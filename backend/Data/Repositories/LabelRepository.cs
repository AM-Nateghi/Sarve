using Sarve.Backend.Models;

namespace Sarve.Backend.Data.Repositories
{
    public class LabelRepository
    {
        private readonly LiteDbContext _context;

        public LabelRepository(LiteDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Label> GetByUserId(string userId)
        {
            return _context.Labels.Find(x => x.UserId == userId).OrderBy(x => x.Name);
        }

        public Label? GetById(string id)
        {
            return _context.Labels.FindById(id);
        }

        public void Insert(Label label)
        {
            _context.Labels.Insert(label);
        }

        public bool Update(Label label)
        {
            return _context.Labels.Update(label);
        }

        public bool Delete(string id)
        {
            return _context.Labels.Delete(id);
        }
    }
}
