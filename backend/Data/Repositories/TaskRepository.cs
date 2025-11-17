using System.Linq.Expressions;
using Sarve.Backend.Models;

namespace Sarve.Backend.Data.Repositories
{
    public class TaskRepository : IRepository<TaskItem>
    {
        private readonly LiteDbContext _context;

        public TaskRepository(LiteDbContext context)
        {
            _context = context;
        }

        public TaskItem? GetById(string id)
        {
            return _context.Tasks.FindById(id);
        }

        public IEnumerable<TaskItem> GetAll()
        {
            return _context.Tasks.FindAll();
        }

        public IEnumerable<TaskItem> Find(Expression<Func<TaskItem, bool>> predicate)
        {
            return _context.Tasks.Find(predicate);
        }

        public TaskItem Insert(TaskItem entity)
        {
            _context.Tasks.Insert(entity);
            return entity;
        }

        public bool Update(TaskItem entity)
        {
            entity.UpdatedAt = DateTime.UtcNow;
            return _context.Tasks.Update(entity);
        }

        public bool Delete(string id)
        {
            return _context.Tasks.Delete(id);
        }

        public int Count()
        {
            return _context.Tasks.Count();
        }

        public int Count(Expression<Func<TaskItem, bool>> predicate)
        {
            return _context.Tasks.Count(predicate);
        }

        public bool Exists(Expression<Func<TaskItem, bool>> predicate)
        {
            return _context.Tasks.Exists(predicate);
        }

        // متدهای اختصاصی Task
        public IEnumerable<TaskItem> GetByUserId(string userId)
        {
            return _context.Tasks.Find(x => x.UserId == userId);
        }

        public IEnumerable<TaskItem> GetBySection(string userId, string sectionId)
        {
            return _context.Tasks.Find(x => x.UserId == userId && x.SectionId == sectionId);
        }

        public IEnumerable<TaskItem> GetCompleted(string userId)
        {
            return _context.Tasks.Find(x => x.UserId == userId && x.IsCompleted);
        }

        public IEnumerable<TaskItem> GetPending(string userId)
        {
            return _context.Tasks.Find(x => x.UserId == userId && !x.IsCompleted);
        }

        public IEnumerable<TaskItem> GetByDeadline(string userId, DateTime from, DateTime to)
        {
            return _context.Tasks.Find(x =>
                x.UserId == userId &&
                x.Deadline.HasValue &&
                x.Deadline.Value >= from &&
                x.Deadline.Value <= to);
        }

        public IEnumerable<TaskItem> GetTodayTasks(string userId)
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);
            return GetByDeadline(userId, today, tomorrow);
        }

        public bool ToggleComplete(string id)
        {
            var task = GetById(id);
            if (task == null) return false;

            task.IsCompleted = !task.IsCompleted;
            task.CompletedAt = task.IsCompleted ? DateTime.UtcNow : null;
            task.UpdatedAt = DateTime.UtcNow;

            return _context.Tasks.Update(task);
        }

        public bool AddTimeSpent(string id, int seconds)
        {
            var task = GetById(id);
            if (task == null) return false;

            task.TimeSpent += seconds;
            task.UpdatedAt = DateTime.UtcNow;

            return _context.Tasks.Update(task);
        }
    }
}
