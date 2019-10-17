using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthO.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class RestrictedController
    {
        public RestrictedController()
        {
        }

        [Authorize]
        [HttpGet]
        public object Get()
        {
            return new { result = "Success!" };
        }
    }
}
