using LiteDB;
using Sarve.Backend.Models;

namespace Sarve.Backend.Data.Repositories
{
    public class LabelRepository
    {
        private readonly LiteDatabase _db;
        private readonly ILiteCollection<Label> _labels;

        public LabelRepository(LiteDatabase db)
        {
            _db = db;
            _labels = _db.GetCollection<Label>("labels");

            // ایجاد Index
            _labels.EnsureIndex(x => x.UserId);
        }

        public IEnumerable<Label> GetByUserId(string userId)
        {
            return _labels.Find(x => x.UserId == userId).OrderBy(x => x.Name);
        }

        public Label? GetById(string id)
        {
            return _labels.FindById(id);
        }

        public void Insert(Label label)
        {
            _labels.Insert(label);
        }

        public bool Update(Label label)
        {
            return _labels.Update(label);
        }

        public bool Delete(string id)
        {
            return _labels.Delete(id);
        }
    }
}
