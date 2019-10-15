using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace DotaDota {
    public class MyHub1 : Hub {
        public void Hello() {
            Clients.All.hello();
        }

        public void Echo(string str) {
            Clients.Others.echo(str);
        }

    }
}