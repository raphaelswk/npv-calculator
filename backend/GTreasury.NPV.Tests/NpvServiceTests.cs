using GTreasury.NPV.Domain;
using GTreasury.NPV.Services.Implementations;

namespace GTreasury.NPV.Tests
{
    public class NpvServiceTests
    {
        private readonly NpvService _npvService;

        public NpvServiceTests()
        {
            _npvService = new NpvService();
        }

        [Fact]
        public async Task CalculateNpvRangeAsync_WithValidInputs_ReturnsCorrectNpv()
        {
            // Arrange
            var request = new CalculationRequest
            {
                CashFlows = new List<double> { -1000, 200, 300, 600 },
                LowerBoundDiscountRate = 0.1,
                UpperBoundDiscountRate = 0.1,
                DiscountRateIncrement = 0.01
            };

            // Act
            var results = await _npvService.CalculateNpvRangeAsync(request).ToListAsync();

            // Assert
            Assert.Single(results);
            Assert.Equal(0.1, results[0].DiscountRate);
            Assert.Equal(-1000 + 200 / 1.1 + 300 / Math.Pow(1.1, 2) + 600 / Math.Pow(1.1, 3), results[0].NetPresentValue, 2);
        }

        [Fact]
        public async Task CalculateNpvRangeAsync_WhenLowerRateIsHigherThanUpper_ThrowsArgumentException()
        {
            // Arrange
            var request = new CalculationRequest
            {
                LowerBoundDiscountRate = 0.2,
                UpperBoundDiscountRate = 0.1,
                DiscountRateIncrement = 0.01
            };

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(async () =>
            {
                await _npvService.CalculateNpvRangeAsync(request).ToListAsync();
            });
        }

        [Fact]
        public async Task CalculateNpv_WithRateOfMinusOne_ReturnsMaxValue()
        {
            // Arrange
            var request = new CalculationRequest
            {
                CashFlows = new List<double> { 100, -200 },
                LowerBoundDiscountRate = -1.0,
                UpperBoundDiscountRate = -1.0,
                DiscountRateIncrement = 0.01
            };

            // Act
            var results = await _npvService.CalculateNpvRangeAsync(request).ToListAsync();

            // Assert
            Assert.Single(results);
            Assert.Equal(double.MaxValue, results[0].NetPresentValue);
        }

        [Fact]
        public async Task CalculateNpvRangeAsync_WithEmptyCashFlows_ReturnsZeroNpv()
        {
            // Arrange
            var request = new CalculationRequest
            {
                CashFlows = new List<double>(),
                LowerBoundDiscountRate = 0.1,
                UpperBoundDiscountRate = 0.1,
                DiscountRateIncrement = 0.01
            };

            // Act
            var results = await _npvService.CalculateNpvRangeAsync(request).ToListAsync();

            // Assert
            Assert.Single(results);
            Assert.Equal(0, results[0].NetPresentValue);
        }
    }
}
