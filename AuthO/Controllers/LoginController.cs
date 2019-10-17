using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AuthO.Interfaces;
using AuthO.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AuthO.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            this._loginService = loginService;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login([FromBody]User user)
        {
            var authUserToken = _loginService.Login(user);

            if (authUserToken == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            return Ok(new { AccessToken = authUserToken });
        }
    }
}
