package models

import (
	"encoding/csv"
	"fmt"
	"math/rand"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"github.com/kr/pretty"
	_ "github.com/lib/pq" //used but not called explicitly
	"github.com/startupXchange-team/gorm"
	_ "github.com/startupXchange-team/gorm/dialects/postgres" //used but not called explicitly

	gormigrate "github.com/startupXchange-team/gormigrate"
)

//AbsPath of code.
const AbsPath string = "/Users/neeraj/Projects/sxc/" // "/home/ubuntu/staging/"

//ServerEnv "$HOME/Projects/sxc/server/.env" .
const ServerEnv string = AbsPath + "server/.env"

var db *gorm.DB
var err error

func init() {

	if e := godotenv.Load(ServerEnv); e != nil {
		fmt.Print(e)
	}

	username := os.Getenv("db_user")
	password := os.Getenv("db_pass")
	dbName := os.Getenv("db_name")
	dbHost := os.Getenv("db_host")

	dbURI := fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s", dbHost, username, dbName, password) //Build connection string

	if db, err = gorm.Open("postgres", dbURI); err != nil {
		fmt.Print(err)
	}
	db.SingularTable(true)
	db.LogMode(true)
	db.DB().SetConnMaxLifetime(10 * time.Second)
	db.DB().SetMaxIdleConns(30)

	// auto-connect，ping per 60s, re-connect on fail or error with intervels 3s, 3s, 15s, 30s, 60s, 60s ...
	go func() { //https://stackoverflow.com/questions/57987883/why-are-database-connections-automatically-closed
		var intervals = []time.Duration{3 * time.Second, 3 * time.Second, 15 * time.Second, 30 * time.Second, 60 * time.Second}
		for {
			time.Sleep(60 * time.Second)
			if pingE := db.DB().Ping(); pingE != nil {
			L:
				for i := 0; i < len(intervals); i++ {
					e2 := RetryHandler(3, func() (bool, error) {

						db, err = gorm.Open("postgres", dbURI)
						if err != nil {
							return false, err
						}
						return true, nil
					})
					if e2 != nil {
						fmt.Println(err.Error())
						time.Sleep(intervals[i])
						if i == len(intervals)-1 {
							i--
						}
						continue
					}
					break L
				}

			}
		}
	}()
	//defer db.Close()

	//db.Debug().AutoMigrate(&User{},db migration
	if errSt := Start(db); errSt != nil {
		pretty.Println("OR FINALLY THIS ERROR?")
		pretty.Println(err.Error())
		return
	}

} /*https://github.com/jinzhu/gorm/issues/1493, https://github.com/jinzhu/gorm/issues/1258, paginator ulule/pilagod/biezhu?,
http://gorm.io/docs/query.html,%20http://jinzhu.me/gorm/crud.html, https://www.reddit.com/r/golang/comments/5f84bu/efficiency_with_go_channels/
https://sysgears.com/notes/get-total-records-count-with-gorm-criteria/, LIBRARIES IO, BOUNTYSOURCE

*/

//GetDB is the exposed point of the database to the rest of the app.
func GetDB() *gorm.DB {
	return db
}

//RetryHandler tries f() n times on fail and one time on success.
func RetryHandler(n int, f func() (bool, error)) error {
	ok, er := f()
	if ok && er == nil {
		return nil
	}
	if n-1 > 0 {
		return RetryHandler(n-1, f)
	}
	return er
}

//Start .
func Start(db *gorm.DB) error {
	m := gormigrate.New(db, gormigrate.DefaultOptions, []*gormigrate.Migration{
		{
			ID: "database",
			Migrate: func(tx *gorm.DB) error {
				tx.DropTableIfExists(&Material{}, &Invoice{}, &Note{})
				pretty.Println("TRYING")
				//errC := nil
				errC := tx.CreateTable(&Material{}, &Invoice{}, &Note{}).Error
				if errC == nil {
					tx.Model(&Material{}).AddForeignKey("invoice_id", "invoices(id)", "RESTRICT", "RESTRICT")
					tx.Model(&Note{}).AddForeignKey("invoice_id", "invoices(id)", "RESTRICT", "RESTRICT")
					pretty.Println("CREATION AND KEYS SHOULD HAVE WORKED.")
					InvoicesFromCSV()
				}
				return errC
			},
			Rollback: func(tx *gorm.DB) error {
				pretty.Println("DIDN'T WORK")
				return tx.DropTable(&Material{}, &Invoice{}, &Note{}).Error
			},
		},
	})
	return m.Migrate()
}

func InvoicesFromCSV() {
	pathInvoices := AbsPath + "server/models/states.csv"
	invoiceCsv, err := os.Open(pathInvoices)
	if err != nil {
		pretty.Println(err.Error())
		return
	}

	pathNotes := AbsPath + "server/models/notes.csv"
	notesCsv, _ := os.Open(pathNotes)
	linesNotes, _ := csv.NewReader(notesCsv).ReadAll()
	noteMatIdx, noteHrIdx := rand.Intn(5), rand.Intn(4)+6
	notesStr := []string{linesNotes[noteMatIdx][0], linesNotes[5][0], linesNotes[noteHrIdx][0]}

	pathMaterials := AbsPath + "server/models/materials.csv"
	materialsCsv, _ := os.Open(pathMaterials)
	matIdx := []int{rand.Intn(8), rand.Intn(8), rand.Intn(8)}
	linesMat, _ := csv.NewReader(materialsCsv).ReadAll()

	linesInvoice, _ := csv.NewReader(invoiceCsv).ReadAll()
	var daysAdd, choice int
	choice = rand.Intn(2)
	if choice == 0 {
		daysAdd = -1
	} else {
		daysAdd = 1
	}

	for _, line := range linesInvoice {
		bHrs, _ := strconv.ParseFloat(line[4], 64)
		wR, _ := strconv.ParseFloat(line[5], 64)
		suppCost, _ := strconv.ParseFloat(line[6], 64)
		var status string

		date := time.Now()
		due := date.AddDate(0, 0, daysAdd)

		if due.Before(date) {
			status = "Late"
		} else {
			status = []string{"Paid", "Outstanding"}[rand.Intn(2)]
		}
		invoice := &Invoice{Name: line[0], CustEmail: line[1], ContrEmail: line[2], Description: line[3], BillableHours: bHrs,
			WageRate: wR, SupplyCost: suppCost, Status: status, DueDate: due,
		}
		db.Create(invoice)
		notes := []Note{Note{Message: notesStr[0]}, {Message: notesStr[1]}, {Message: notesStr[2]}}
		materials := []Material{Material{Name: linesMat[matIdx[0]][0]}, {Name: linesMat[matIdx[1]][0]}, {Name: linesMat[matIdx[2]][0]}}
		db.Table("invoices").First(invoice).Association("Materials").Append(materials)
		db.Table("invoices").First(invoice).Association("Notes").Append(notes)
		db.Save(invoice)

	}

}
