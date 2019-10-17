using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using AuthO.Interfaces;
using AuthO.ViewModels;
using Microsoft.IdentityModel.Tokens;

namespace AuthO.Services
{
    public class LoginService: ILoginService
    {
        //unsecure secret and should be stored in a setting-config or similiar
        string SecretToken = "mysecrettoken_abc";
        string TokenIssuer = "webserva";

        public LoginService()
        {
        }

        private string GenerateJSONWebToken(User user)
        {
            //secret token and the algorithm to use
            var secretToken = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretToken)); //_settings.
            var credentials = new SigningCredentials(secretToken, SecurityAlgorithms.HmacSha256);

            // creating a with one hour validity. 
            var token = new JwtSecurityToken(TokenIssuer, //_settings.
            null,
            null,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string Login(User user)
        {
            //hardcoded values just to try 
            if (user.Username == "admin" && user.Password == "random")
                return GenerateJSONWebToken(user);
            else
                return null;
        }
    }
}
