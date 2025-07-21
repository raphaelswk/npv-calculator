using System.ComponentModel.DataAnnotations;

namespace GTreasury.NPV.Domain
{
    public class CalculationRequest
    {
        [Required]
        public IEnumerable<double> CashFlows { get; set; } = new List<double>();

        [Range(0, 1, ErrorMessage = "Lower bound rate must be between 0 (0%) and 1 (100%).")]
        public double LowerBoundDiscountRate { get; set; }

        [Range(0, 1, ErrorMessage = "Upper bound rate must be between 0 (0%) and 1 (100%).")]
        public double UpperBoundDiscountRate { get; set; }

        [Range(0.0001, 1, ErrorMessage = "Increment must be greater than 0 and at most 1.")]
        public double DiscountRateIncrement { get; set; }
    }
}
