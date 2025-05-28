using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Obralia.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "ProfessionalProfiles",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Icon = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionalProfiles_CategoryId",
                table: "ProfessionalProfiles",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProfessionalProfiles_Categories_CategoryId",
                table: "ProfessionalProfiles",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProfessionalProfiles_Categories_CategoryId",
                table: "ProfessionalProfiles");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_ProfessionalProfiles_CategoryId",
                table: "ProfessionalProfiles");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "ProfessionalProfiles");
        }
    }
}
