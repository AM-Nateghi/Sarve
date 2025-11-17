using System.Linq.Expressions;
using Sarve.Backend.Models;

namespace Sarve.Backend.Data.Repositories
{
    public class SectionRepository : IRepository<Section>
    {
        private readonly LiteDbContext _context;

        public SectionRepository(LiteDbContext context)
        {
            _context = context;
        }

        public Section? GetById(string id)
        {
            return _context.Sections.FindById(id);
        }

        public IEnumerable<Section> GetAll()
        {
            return _context.Sections.FindAll();
        }

        public IEnumerable<Section> Find(Expression<Func<Section, bool>> predicate)
        {
            return _context.Sections.Find(predicate);
        }

        public Section Insert(Section entity)
        {
            _context.Sections.Insert(entity);
            return entity;
        }

        public bool Update(Section entity)
        {
            return _context.Sections.Update(entity);
        }

        public bool Delete(string id)
        {
            var section = GetById(id);
            if (section == null || !section.IsDeletable)
                return false;

            return _context.Sections.Delete(id);
        }

        public int Count()
        {
            return _context.Sections.Count();
        }

        public int Count(Expression<Func<Section, bool>> predicate)
        {
            return _context.Sections.Count(predicate);
        }

        public bool Exists(Expression<Func<Section, bool>> predicate)
        {
            return _context.Sections.Exists(predicate);
        }

        // متدهای اختصاصی Section
        public IEnumerable<Section> GetByUserId(string userId)
        {
            return _context.Sections.Find(x => x.UserId == userId)
                .OrderBy(x => x.Order);
        }

        public Section? GetDefaultSection(string userId)
        {
            return _context.Sections.FindOne(x => x.UserId == userId && !x.IsDeletable);
        }

        public void EnsureDefaultSection(string userId)
        {
            var exists = Exists(x => x.UserId == userId && !x.IsDeletable);
            if (!exists)
            {
                Insert(new Section
                {
                    Id = "default",
                    UserId = userId,
                    Name = "عمومی",
                    IsDeletable = false,
                    Order = 0
                });
            }
        }
    }
}
