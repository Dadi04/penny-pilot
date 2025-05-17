using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddedSubcategoryToCategoryAddedTimeToTransaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeSpan>(
                name: "Time",
                table: "Transactions",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<int>(
                name: "SubcategoryId",
                table: "Categories",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_SubcategoryId",
                table: "Categories",
                column: "SubcategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Categories_SubcategoryId",
                table: "Categories",
                column: "SubcategoryId",
                principalTable: "Categories",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Categories_SubcategoryId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_SubcategoryId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "Time",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "SubcategoryId",
                table: "Categories");
        }
    }
}
