using LiteDB;
using Microsoft.Extensions.Options;

namespace Sarve.Backend.Data
{
    public class LiteDbContext : IDisposable
    {
        private readonly LiteDatabase _database;

        public LiteDbContext(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("LiteDb")
                ?? "Filename=./Data/sarve.db;Connection=shared";

            // ایجاد پوشه Data اگر وجود نداشت
            var dbPath = Path.GetDirectoryName(connectionString.Split(';')[0].Replace("Filename=", ""));
            if (!string.IsNullOrEmpty(dbPath) && !Directory.Exists(dbPath))
            {
                Directory.CreateDirectory(dbPath);
            }

            _database = new LiteDatabase(connectionString);

            // تنظیم Indexes برای بهبود performance
            SetupIndexes();
        }

        // Collections
        public ILiteCollection<Models.User> Users => _database.GetCollection<Models.User>("users");
        public ILiteCollection<Models.TaskItem> Tasks => _database.GetCollection<Models.TaskItem>("tasks");
        public ILiteCollection<Models.Section> Sections => _database.GetCollection<Models.Section>("sections");
        public ILiteCollection<Models.Label> Labels => _database.GetCollection<Models.Label>("labels");
        public ILiteCollection<Models.Goal> Goals => _database.GetCollection<Models.Goal>("goals");
        public ILiteCollection<Models.AudioSession> AudioSessions => _database.GetCollection<Models.AudioSession>("audio_sessions");

        private void SetupIndexes()
        {
            // User indexes
            Users.EnsureIndex(x => x.Email, true); // Unique
            Users.EnsureIndex(x => x.PhoneNumber);
            Users.EnsureIndex(x => x.GoogleEmail);

            // Task indexes
            Tasks.EnsureIndex(x => x.UserId);
            Tasks.EnsureIndex(x => x.SectionId);
            Tasks.EnsureIndex(x => x.IsCompleted);
            Tasks.EnsureIndex(x => x.Deadline);

            // Section indexes
            Sections.EnsureIndex(x => x.UserId);

            // Label indexes
            Labels.EnsureIndex(x => x.UserId);

            // Goal indexes
            Goals.EnsureIndex(x => x.UserId);

            // AudioSession indexes
            AudioSessions.EnsureIndex(x => x.UserId);
        }

        public void Dispose()
        {
            _database?.Dispose();
        }
    }
}
