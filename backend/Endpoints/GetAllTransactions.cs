using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Endpoints {
    public static class GetAllTransactionsEndpoint {
        public static void MapGetAllTransactionsEndpoint(this WebApplication app) {
            app.MapGet("/api/get-all-transactions", async (ApplicationDbContext db) => {
                var transactions = await db.Transactions
                    .Include(t => t.Account)
                    .Include(t => t.Category)
                    .ToListAsync();

                return Results.Ok(transactions);
            })
            .WithName("GetAllTransactions");
        }
    }
}