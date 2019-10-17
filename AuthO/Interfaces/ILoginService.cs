using System;
using AuthO.ViewModels;

namespace AuthO.Interfaces
{
    public interface ILoginService
    {
        string Login(User user);
    }
}
