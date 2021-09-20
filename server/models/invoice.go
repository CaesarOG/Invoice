package models

import (
	"time"

	uuid "github.com/gofrs/uuid"
	_ "github.com/lib/pq" //used but not called explicitly
	"github.com/startupXchange-team/gorm"
	_ "github.com/startupXchange-team/gorm/dialects/postgres" //blabla
)

// Invoice def
type Invoice struct {
	gorm.Model
	Name          string      `json:"name"`
	CustID        *uuid.UUID  `json:"custID"`
	ContrID       *uuid.UUID  `json:"contrID"`
	CustEmail     string      `json:"custEmail"`
	ContrEmail    string      `json:"contrEmail"`
	Description   string      `json:"description"`
	BillableHours float64     `json:"billableHrs"`
	WageRate      float64     `json:"WageRate"`
	SupplyCost    float64     `json:"supplyCost"`
	Materials     []*Material `json:"materials" gorm:"many2many:invoice_materials;"`
	Notes         []Note      `json:"notes"`
	Status        string      `json:"status"`
	DueDate       time.Time   `json:"dueDate"`
}

// Material def
type Material struct {
	gorm.Model
	Name    string     `json:"name"`
	Invoice []*Invoice `json:"invoices" gorm:"many2many:invoice_materials;"`
}

type Note struct {
	gorm.Model
	Message   string     `json:"message"`
	InvoiceID *uuid.UUID `json:"invoiceID" gorm:"type:uuid;not null;"`
}

/* ADD'L NORMAL SLASH-COMMENT ANYTHING FINISHED!


// routes for:
//  - create
// 	- get all invoices
// 	- add line items incl. notes

client epics for:
	- email
	- all routes (option filter for late in getall)

client alert:
	- due date is passed(so, late)

// client login & register:
// 	- just do it YYST SHIA

*/
