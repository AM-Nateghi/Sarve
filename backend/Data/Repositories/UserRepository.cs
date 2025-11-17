using System.Linq.Expressions;
using Sarve.Backend.Models;

namespace Sarve.Backend.Data.Repositories
{
    public class UserRepository : IRepository<User>
    {
        private readonly LiteDbContext _context;

        public UserRepository(LiteDbContext context)
        {
            _context = context;
        }

        public User? GetById(string id)
        {
            return _context.Users.FindById(id);
        }

        public IEnumerable<User> GetAll()
        {
            return _context.Users.FindAll();
        }

        public IEnumerable<User> Find(Expression<Func<User, bool>> predicate)
        {
            return _context.Users.Find(predicate);
        }

        public User Insert(User entity)
        {
            _context.Users.Insert(entity);
            return entity;
        }

        public bool Update(User entity)
        {
            entity.UpdatedAt = DateTime.UtcNow;
            return _context.Users.Update(entity);
        }

        public bool Delete(string id)
        {
            return _context.Users.Delete(id);
        }

        public int Count()
        {
            return _context.Users.Count();
        }

        public int Count(Expression<Func<User, bool>> predicate)
        {
            return _context.Users.Count(predicate);
        }

        public bool Exists(Expression<Func<User, bool>> predicate)
        {
            return _context.Users.Exists(predicate);
        }

        // متدهای اختصاصی User
        public User? GetByEmail(string email)
        {
            return _context.Users.FindOne(x => x.Email == email);
        }

        public User? GetByPhoneNumber(string phoneNumber)
        {
            return _context.Users.FindOne(x => x.PhoneNumber == phoneNumber);
        }

        public User? GetByGoogleEmail(string googleEmail)
        {
            return _context.Users.FindOne(x => x.GoogleEmail == googleEmail);
        }

        public bool EmailExists(string email)
        {
            return Exists(x => x.Email == email);
        }

        public bool PhoneExists(string phone)
        {
            return Exists(x => x.PhoneNumber == phone);
        }
    }
}
