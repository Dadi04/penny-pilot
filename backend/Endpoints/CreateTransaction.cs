using backend.Models;

namespace backend.Endpoints {
    public static class CreateTransactionEndpoint {
        public static void MapCreateTransactionEndpoint(this WebApplication app) {
            app.MapPost("/api/create-transaction", async (HttpRequest request, ApplicationDbContext db) => {
                var transaction = await request.ReadFromJsonAsync<Transaction>();
                if (transaction == null) {
                    return Results.BadRequest();
                }

                db.Transactions.Add(transaction);
                await db.SaveChangesAsync();

                return Results.Json(new { success = true });
            })
            .WithName("CreateTransaction");
        }
    }
}