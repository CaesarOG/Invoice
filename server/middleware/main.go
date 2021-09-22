package middleware

import (
	"encoding/json"
	"os"
	"strings"

	"server/models"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gofrs/uuid"
	"github.com/startupXchange-team/gorm"
	"github.com/valyala/fasthttp"
)

const (
	corsAllowHeaders     = "authorization, Authorization, Content-Type, Access-Control-Allow-Headers, Offset, Limit, Place, Query, EditScreen, timepd"
	corsAllowMethods     = "HEAD,GET,POST,PUT,DELETE,OPTIONS"
	corsAllowOrigin      = "*"
	corsAllowCredentials = "true"
)

//Token for JWT
type Token struct {
	UserID uuid.UUID
	jwt.StandardClaims
}

// Response object
var Response = make(map[string]interface{})

//CORS middleware. https://stackoverflow.com/questions/25727306/request-header-field-access-control-allow-headers-is-not-allowed-by-access-contr
func CORS(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	return fasthttp.RequestHandler(func(ctx *fasthttp.RequestCtx) { // NOTE! All mdw wrapped with cast to the type, not even necs. for such literal btw
		ctx.Response.Header.Set("Access-Control-Allow-Credentials", corsAllowCredentials)
		ctx.Response.Header.Set("Access-Control-Allow-Headers", corsAllowHeaders)
		ctx.Response.Header.Set("Access-Control-Allow-Methods", corsAllowMethods)
		ctx.Response.Header.Set("Access-Control-Allow-Origin", corsAllowOrigin)

		next(ctx)
		return

	})
}

//JWT middleware.
func JWT(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	return fasthttp.RequestHandler(func(ctx *fasthttp.RequestCtx) {
		tokenHeader := ctx.Request.Header.Peek("Authorization") //first get header, it returns []byte so take all of it with [:] and convert to string
		tokenString := string(tokenHeader[:])

		if tokenString == "" {
			ResponseMaker(ctx, fasthttp.StatusForbidden, false, "Missing Auth Token.", "noData")
			return
		}

		splitted := strings.Split(tokenString, " ")
		if len(splitted) != 2 {
			ResponseMaker(ctx, fasthttp.StatusForbidden, false, "Invalid/Malformed Auth Token.", "noData")
			return
		}

		tokenPart := splitted[1] //Grab the token part, the part we are truly interested in
		tk := Token{}

		token, err := jwt.ParseWithClaims(tokenPart, tk, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("token_password")), nil
		})

		if err != nil {
			ResponseMaker(ctx, fasthttp.StatusForbidden, false, "Malformed Authentication Token.", "noData")
			return
		}

		if !token.Valid {
			ResponseMaker(ctx, fasthttp.StatusForbidden, false, "Token Is Not Valid.", "noData")
			return
		}

		user := &models.User{}
		errU := models.GetDB().Table("user").Where("id = ?", tk.UserID).First(user).Error
		if errU != nil {
			if errU == gorm.ErrRecordNotFound {
				ResponseMaker(ctx, fasthttp.StatusUnauthorized, false, "User Not Found.", "noData")
				return
			}
			//last possible error
			ResponseMaker(ctx, fasthttp.StatusInternalServerError, false, "Connection Error.", "noData")
			return
		}

		//Worked! Proceed.
		user.Password = ""
		//user.Logs = nil
		//Response = map[string]interface{}{"status": true, "message": "Token Verified, OK."}
		userJSONBytes, _ := json.Marshal(map[string]interface{}{"user": user})
		ctx.Response.AppendBody(userJSONBytes)
		next(ctx)
		return
	})
}

// ResponseMaker convenience method.
func ResponseMaker(ctx *fasthttp.RequestCtx, code int, status bool, message string, data interface{}) {
	Response = map[string]interface{}{"status": status, "message": message, "data": data}
	ctx.Response.SetStatusCode(code)
	ctx.Response.Header.Set("Content-Type", "application/json")
	json.NewEncoder(ctx).Encode(Response)
}
