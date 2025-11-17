using System.Linq.Expressions;

namespace Sarve.Backend.Data
{
    public interface IRepository<T> where T : class
    {
        // CRUD عملیات
        T? GetById(string id);
        IEnumerable<T> GetAll();
        IEnumerable<T> Find(Expression<Func<T, bool>> predicate);
        T Insert(T entity);
        bool Update(T entity);
        bool Delete(string id);

        // عملیات اضافی
        int Count();
        int Count(Expression<Func<T, bool>> predicate);
        bool Exists(Expression<Func<T, bool>> predicate);
    }
}
