using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Obralia.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCategoriesAndAddBookings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Categories_ParentCategoryId",
                table: "Categories");

            migrationBuilder.DropForeignKey(
                name: "FK_PortfolioItems_Users_UserId",
                table: "PortfolioItems");

            migrationBuilder.DropForeignKey(
                name: "FK_ServiceCategories_Categories_CategoryId",
                table: "ServiceCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_ServiceCategories_Services_ServiceId",
                table: "ServiceCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_Services_Users_UserId",
                table: "Services");

            migrationBuilder.DropTable(
                name: "ProfessionalCategories");

            migrationBuilder.DropTable(
                name: "ProfessionalSkills");

            migrationBuilder.DropTable(
                name: "Skills");

            migrationBuilder.DropIndex(
                name: "IX_Categories_ParentCategoryId",
                table: "Categories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Services",
                table: "Services");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ServiceCategories",
                table: "ServiceCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PortfolioItems",
                table: "PortfolioItems");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "ProfessionalAvailabilities");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "ProfessionalAvailabilities");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "ParentCategoryId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Categories");

            migrationBuilder.RenameTable(
                name: "Services",
                newName: "Service");

            migrationBuilder.RenameTable(
                name: "ServiceCategories",
                newName: "ServiceCategory");

            migrationBuilder.RenameTable(
                name: "PortfolioItems",
                newName: "PortfolioItem");

            migrationBuilder.RenameColumn(
                name: "ProfessionalProfileId",
                table: "ProfessionalAvailabilities",
                newName: "ProfessionalId");

            migrationBuilder.RenameIndex(
                name: "IX_ProfessionalAvailabilities_ProfessionalProfileId",
                table: "ProfessionalAvailabilities",
                newName: "IX_ProfessionalAvailabilities_ProfessionalId");

            migrationBuilder.RenameIndex(
                name: "IX_Services_UserId",
                table: "Service",
                newName: "IX_Service_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_ServiceCategories_ServiceId",
                table: "ServiceCategory",
                newName: "IX_ServiceCategory_ServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_ServiceCategories_CategoryId",
                table: "ServiceCategory",
                newName: "IX_ServiceCategory_CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_PortfolioItems_UserId",
                table: "PortfolioItem",
                newName: "IX_PortfolioItem_UserId");

            migrationBuilder.AddColumn<Guid>(
                name: "ProfessionalProfileId",
                table: "Reviews",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ProfessionalProfiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVerified",
                table: "ProfessionalProfiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "ProfessionalAvailabilities",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Categories",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Categories",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Service",
                table: "Service",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ServiceCategory",
                table: "ServiceCategory",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PortfolioItem",
                table: "PortfolioItem",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "CategoryProfessionalProfile",
                columns: table => new
                {
                    CategoriesId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfessionalsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryProfessionalProfile", x => new { x.CategoriesId, x.ProfessionalsId });
                    table.ForeignKey(
                        name: "FK_CategoryProfessionalProfile_Categories_CategoriesId",
                        column: x => x.CategoriesId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CategoryProfessionalProfile_ProfessionalProfiles_Profession~",
                        column: x => x.ProfessionalsId,
                        principalTable: "ProfessionalProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProfessionalBookings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfessionalId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClientId = table.Column<Guid>(type: "uuid", nullable: false),
                    StartTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    Location = table.Column<string>(type: "text", nullable: true),
                    Price = table.Column<decimal>(type: "numeric", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessionalBookings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfessionalBookings_ProfessionalProfiles_ProfessionalId",
                        column: x => x.ProfessionalId,
                        principalTable: "ProfessionalProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfessionalBookings_Users_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ProfessionalProfileId",
                table: "Reviews",
                column: "ProfessionalProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_CategoryProfessionalProfile_ProfessionalsId",
                table: "CategoryProfessionalProfile",
                column: "ProfessionalsId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionalBookings_ClientId",
                table: "ProfessionalBookings",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionalBookings_ProfessionalId",
                table: "ProfessionalBookings",
                column: "ProfessionalId");

            migrationBuilder.AddForeignKey(
                name: "FK_PortfolioItem_Users_UserId",
                table: "PortfolioItem",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_ProfessionalProfiles_ProfessionalProfileId",
                table: "Reviews",
                column: "ProfessionalProfileId",
                principalTable: "ProfessionalProfiles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Service_Users_UserId",
                table: "Service",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceCategory_Categories_CategoryId",
                table: "ServiceCategory",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceCategory_Service_ServiceId",
                table: "ServiceCategory",
                column: "ServiceId",
                principalTable: "Service",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PortfolioItem_Users_UserId",
                table: "PortfolioItem");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_ProfessionalProfiles_ProfessionalProfileId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Service_Users_UserId",
                table: "Service");

            migrationBuilder.DropForeignKey(
                name: "FK_ServiceCategory_Categories_CategoryId",
                table: "ServiceCategory");

            migrationBuilder.DropForeignKey(
                name: "FK_ServiceCategory_Service_ServiceId",
                table: "ServiceCategory");

            migrationBuilder.DropTable(
                name: "CategoryProfessionalProfile");

            migrationBuilder.DropTable(
                name: "ProfessionalBookings");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_ProfessionalProfileId",
                table: "Reviews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ServiceCategory",
                table: "ServiceCategory");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Service",
                table: "Service");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PortfolioItem",
                table: "PortfolioItem");

            migrationBuilder.DropColumn(
                name: "ProfessionalProfileId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ProfessionalProfiles");

            migrationBuilder.DropColumn(
                name: "IsVerified",
                table: "ProfessionalProfiles");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "ProfessionalAvailabilities");

            migrationBuilder.RenameTable(
                name: "ServiceCategory",
                newName: "ServiceCategories");

            migrationBuilder.RenameTable(
                name: "Service",
                newName: "Services");

            migrationBuilder.RenameTable(
                name: "PortfolioItem",
                newName: "PortfolioItems");

            migrationBuilder.RenameColumn(
                name: "ProfessionalId",
                table: "ProfessionalAvailabilities",
                newName: "ProfessionalProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_ProfessionalAvailabilities_ProfessionalId",
                table: "ProfessionalAvailabilities",
                newName: "IX_ProfessionalAvailabilities_ProfessionalProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_ServiceCategory_ServiceId",
                table: "ServiceCategories",
                newName: "IX_ServiceCategories_ServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_ServiceCategory_CategoryId",
                table: "ServiceCategories",
                newName: "IX_ServiceCategories_CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Service_UserId",
                table: "Services",
                newName: "IX_Services_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_PortfolioItem_UserId",
                table: "PortfolioItems",
                newName: "IX_PortfolioItems_UserId");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "ProfessionalAvailabilities",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "ProfessionalAvailabilities",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Categories",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Categories",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Categories",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "ParentCategoryId",
                table: "Categories",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Categories",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ServiceCategories",
                table: "ServiceCategories",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Services",
                table: "Services",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PortfolioItems",
                table: "PortfolioItems",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "ProfessionalCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfessionalProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessionalCategories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfessionalCategories_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfessionalCategories_ProfessionalProfiles_ProfessionalPro~",
                        column: x => x.ProfessionalProfileId,
                        principalTable: "ProfessionalProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Skills",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Skills", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProfessionalSkills",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfessionalProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    YearsOfExperience = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessionalSkills", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfessionalSkills_ProfessionalProfiles_ProfessionalProfile~",
                        column: x => x.ProfessionalProfileId,
                        principalTable: "ProfessionalProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfessionalSkills_Skills_SkillId",
                        column: x => x.SkillId,
                        principalTable: "Skills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_ParentCategoryId",
                table: "Categories",
                column: "ParentCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionalCategories_CategoryId",
                table: "ProfessionalCategories",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionalCategories_ProfessionalProfileId",
                table: "ProfessionalCategories",
                column: "ProfessionalProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionalSkills_ProfessionalProfileId",
                table: "ProfessionalSkills",
                column: "ProfessionalProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionalSkills_SkillId",
                table: "ProfessionalSkills",
                column: "SkillId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Categories_ParentCategoryId",
                table: "Categories",
                column: "ParentCategoryId",
                principalTable: "Categories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PortfolioItems_Users_UserId",
                table: "PortfolioItems",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceCategories_Categories_CategoryId",
                table: "ServiceCategories",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceCategories_Services_ServiceId",
                table: "ServiceCategories",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Services_Users_UserId",
                table: "Services",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
