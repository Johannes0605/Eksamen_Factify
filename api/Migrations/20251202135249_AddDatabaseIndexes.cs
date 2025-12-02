using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Factify.Migrations
{
    /// <inheritdoc />
    public partial class AddDatabaseIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Quizzes_UserId_CreatedDate",
                table: "Quizzes",
                columns: new[] { "UserId", "CreatedDate" });

            migrationBuilder.CreateIndex(
                name: "IX_Quizzes_UserId_LastUsedDate",
                table: "Quizzes",
                columns: new[] { "UserId", "LastUsedDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Quizzes_UserId_CreatedDate",
                table: "Quizzes");

            migrationBuilder.DropIndex(
                name: "IX_Quizzes_UserId_LastUsedDate",
                table: "Quizzes");
        }
    }
}
