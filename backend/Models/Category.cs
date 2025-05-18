using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models {
    public class Category {
        [Key]
        public int Id { get; set; }
        public string Emoji { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public List<Category>? Subcategory { get; set; } = new List<Category>();
        public string? Description { get; set; } = string.Empty;
    }
}