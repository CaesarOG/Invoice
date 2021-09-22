package models

import (
	uuid "github.com/gofrs/uuid"
	_ "github.com/lib/pq" //used but not called explicitly
	"github.com/startupXchange-team/gorm"
	_ "github.com/startupXchange-team/gorm/dialects/postgres" //blabla
)

type User struct {
	gorm.Model
	Email         string              `json:"email"`
	Password      string              `json:"password"`
	Phone         string              `json:"phone"`
	FirstName     string              `json:"firstName"`
	LastName      string              `json:"lastName"`
	FullName      string              `json:"fullName"`
	Role          string              `json:"role"`
	InvoicesCust  []Invoice           `json:"custInvoices" gorm:"foreignkey:CustID;"`
	InvoicesContr []Invoice           `json:"contrInvoices" gorm:"foreignkey:ContrID;"`
	MapInvPaid    map[*uuid.UUID]bool `json:"mapInvPaid" sql:"-"`
}
