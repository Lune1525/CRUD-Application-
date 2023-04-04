using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Employee.Models
{
    public class EmployeeContext : DbContext
    {
        public EmployeeContext(DbContextOptions<EmployeeContext> options)
            : base(options)
        {

        }
        public DbSet<Employees> Employee { get; set; }
    }
}
