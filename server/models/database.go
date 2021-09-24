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
	"golang.org/x/crypto/bcrypt"

	gormigrate "github.com/startupXchange-team/gormigrate"
)

//AbsPath of code.
const AbsPath string = "/home/ubuntu/Invoice/" //Users/neeraj/Projects/frontend-homework/"

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
	//db.LogMode(true)
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
				tx.DropTableIfExists(&Material{}, &Invoice{}, &Note{}, &Usertype{})
				pretty.Println("TRYING")
				//errC := nil
				errC := tx.CreateTable(&Material{}, &Invoice{}, &Note{}, &Usertype{}).Error
				if errC == nil {
					tx.Model(&Note{}).AddForeignKey("invoice_id", "invoice(id)", "RESTRICT", "RESTRICT")
					tx.Model(&Invoice{}).AddForeignKey("cust_id", "usertype(id)", "RESTRICT", "RESTRICT")
					tx.Model(&Invoice{}).AddForeignKey("contr_id", "usertype(id)", "RESTRICT", "RESTRICT")
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
	pathInvoices := AbsPath + "server/models/invoices.csv"
	invoiceCsv, err := os.Open(pathInvoices)
	if err != nil {
		pretty.Println(err.Error())
		return
	}

	pathMaterials := AbsPath + "server/models/materials.csv"
	materialsCsv, _ := os.Open(pathMaterials)
	matIdx := rand.Intn(6)
	linesMat, _ := csv.NewReader(materialsCsv).ReadAll()

	linesInvoice, _ := csv.NewReader(invoiceCsv).ReadAll()

	pathNotes := AbsPath + "server/models/notes.csv"
	notesCsv, _ := os.Open(pathNotes)
	linesNotes, _ := csv.NewReader(notesCsv).ReadAll()
	noteMatIdx, noteHrIdx := rand.Intn(5), rand.Intn(4)+6
	notesStr := []string{linesNotes[noteMatIdx][0], linesNotes[5][0], linesNotes[noteHrIdx][0]}

	var daysAdd, choice int
	choice = rand.Intn(2)
	if choice == 0 {
		daysAdd = -1
	} else {
		daysAdd = 1
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(","), bcrypt.DefaultCost)
	pwd := string(hashedPassword)
	admin := Usertype{Role: "Admin", Email: "deep", Password: pwd, FirstName: "Ad", LastName: "Min"}
	y := Usertype{Role: "Contractor", Email: "y@gmail.com", Password: pwd, FirstName: "Contr", LastName: "Actor"}
	c1 := Usertype{Role: "Customer", Email: "policygradient@gmail.com", Password: pwd, FirstName: "Cust", LastName: "Omer"}
	c3 := &Usertype{Role: "Customer", Email: "TDlambda@gmail.com", Password: pwd, FirstName: "Cust-3", LastName: "3-Omer"}
	c2 := Usertype{Role: "Customer", Email: "expectedsarsa@gmail.com", Password: pwd, FirstName: "Cust-2", LastName: "2-Omer"}
	db.Model(&Usertype{}).Create(&admin).Create(&y).Create(&c1).Create(&c2).Create(c3)

	neeraj, rajiv := &Usertype{}, &Usertype{}
	neeraj.Email, rajiv.Email = "neerajram108@gmail.com", "rajivprabhakar@gmail.com"
	db.Create(neeraj)
	db.Create(rajiv)
	a, b := &Usertype{}, &Usertype{}
	db.Model(&Usertype{}).Where("email = ?", `neerajram108@gmail.com`).Find(a)
	db.Model(&Usertype{}).Where("email = ?", `rajivprabhakar@gmail.com`).Find(b)

	for _, line := range linesMat {
		mat := &Material{Name: line[0]}
		db.Create(mat)
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
			WageRate: wR, SupplyCost: suppCost, Status: status, DueDate: due, CustID: a.ID, ContrID: b.ID,
		}

		db.Create(invoice)
		notes := &[]Note{Note{Message: notesStr[0]}, {Message: notesStr[1]}, {Message: notesStr[2]}}
		materials := []Material{}
		db.Table("material").Where("name = ? OR name = ? OR name = ?", linesMat[matIdx][0], linesMat[matIdx+1][0], linesMat[matIdx+2][0]).Find(&materials)
		db.Table("invoice").First(invoice).Association("Notes").Append(notes)
		db.Table("invoice").First(invoice).Association("Materials").Append(materials)
		db.Save(invoice)

	}

}
