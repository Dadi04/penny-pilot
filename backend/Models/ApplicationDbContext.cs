using Microsoft.EntityFrameworkCore;

namespace backend.Models {
    public class ApplicationDbContext : DbContext {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }
        
        
    }
}