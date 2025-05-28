using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Obralia.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixFavoriteReviewNavigation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Favorites_Users_UserId1",
                table: "Favorites");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Users_UserId1",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_UserId1",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Favorites_UserId1",
                table: "Favorites");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Favorites");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "Reviews",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "Favorites",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId1",
                table: "Reviews",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_Favorites_UserId1",
                table: "Favorites",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Favorites_Users_UserId1",
                table: "Favorites",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Users_UserId1",
                table: "Reviews",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
