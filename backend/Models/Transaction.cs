using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models {
    public class Transaction {
        [Key]
        public int Id { get; set; }
        public int AccountId { get; set; }
        public Account? Account { get; set; } = new Account();
        public int CategoryId { get; set; }
        public Category? Category { get; set; } = new Category();
        public string Name { get; set; } = string.Empty; 
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.Now.Date;
        public TimeSpan Time { get; set; } = DateTime.Now.TimeOfDay;
        public string Type { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public List<string>? Tags { get; set; } = new List<string>();
        public string? Location { get; set; } = string.Empty;
    }
}