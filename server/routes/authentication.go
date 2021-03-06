package routes

import (
	"bytes"
	"encoding/json"
	"os"

	"server/middleware"
	"server/models"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/kr/pretty"
	"github.com/startupXchange-team/gorm"
	"github.com/valyala/fasthttp"
	"golang.org/x/crypto/bcrypt"
)

//https://github.com/golang/go/wiki/Modules for go.mod file for stripe-go.

//Login handler
func Login(ctx *fasthttp.RequestCtx) {

	type userReq struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	userAttempt := &userReq{}
	body := ctx.Request.Body()
	errJ := json.NewDecoder(bytes.NewReader(body)).Decode(userAttempt)
	//errJ := json.Unmarshal(body, userAttempt)

	if errJ != nil {
		middleware.ResponseMaker(ctx, fasthttp.StatusBadRequest, false, "Invalid/Missing Login Info.", "noData")
		return
	}

	user := models.Usertype{}
	err := models.GetDB().Model(&models.Usertype{}).Where("email = ?", userAttempt.Email).First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			middleware.ResponseMaker(ctx, fasthttp.StatusUnauthorized, false, "Email Address Not Found.", "noData")
			return
		}

		middleware.ResponseMaker(ctx, fasthttp.StatusInternalServerError, false, "Connection Error.", "noData")
		return

	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userAttempt.Password))
	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		middleware.ResponseMaker(ctx, fasthttp.StatusUnauthorized, false, "Incorrect Password. Please Try Again.", "noData")
		return
	}

	//Worked! Logged in.
	user.Password = ""

	tk := &middleware.Token{UserID: *user.ID}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(os.Getenv("token_password")))

	data := map[string]interface{}{}

	data["token"] = tokenString
	data["user"] = user

	middleware.ResponseMaker(ctx, fasthttp.StatusOK, true, "Logged In.", data)

}

//Register handler
func Register(ctx *fasthttp.RequestCtx) {

	type userReq struct {
		Email     string `json:"email"`
		Password  string `json:"password"`
		Role      string `json:"role"`
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
	}
	userAttempt := &userReq{}
	body := ctx.Request.Body()
	errJ := json.NewDecoder(bytes.NewReader(body)).Decode(userAttempt)
	user := models.Usertype{FirstName: userAttempt.FirstName, LastName: userAttempt.LastName, Email: userAttempt.Email, Password: userAttempt.Password,
		FullName: userAttempt.FirstName + " " + userAttempt.LastName, Role: userAttempt.Role}

	if errJ != nil {
		middleware.ResponseMaker(ctx, fasthttp.StatusBadRequest, false, "Invalid/Missing Register Info.", "noData")
		return
	}

	temp := &models.Usertype{}
	err := models.GetDB().Model(&models.Usertype{}).Where("email = ?", userAttempt.Email).First(temp).Error
	if err != nil && err != gorm.ErrRecordNotFound { //need NotFound to make new account,  if it's not that then:
		pretty.Println("error!: " + err.Error())
		middleware.ResponseMaker(ctx, fasthttp.StatusInternalServerError, false, "Connection Error.", "noData")
		return
	}
	if temp.Email != "" { //so didn't get ,,notfound error
		middleware.ResponseMaker(ctx, fasthttp.StatusNotAcceptable, false, "Email address already in use.", "noData")
		return
	}

	//All good, register user.
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)

	errC := models.GetDB().Create(&user).Error

	if user.ID == nil || user.ID.Bytes() == nil || errC != nil {
		middleware.ResponseMaker(ctx, fasthttp.StatusInternalServerError, false, "Failed To Create Account, Database Error.", "noData")
		return
	}

	//Worked! Registered User.
	user.Password = ""

	tk := &middleware.Token{UserID: *user.ID}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(os.Getenv("token_password")))

	data := map[string]interface{}{"token": tokenString, "user": user}
	middleware.ResponseMaker(ctx, fasthttp.StatusOK, true, "Registered.", data)

}
