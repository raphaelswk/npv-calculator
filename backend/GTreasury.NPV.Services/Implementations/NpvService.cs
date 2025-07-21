using GTreasury.NPV.Domain;
using GTreasury.NPV.Services.Interfaces;

namespace GTreasury.NPV.Services.Implementations
{
    public class NpvService : INpvService
    {
        public async IAsyncEnumerable<NpvResult> CalculateNpvRangeAsync(CalculationRequest request)
        {
            if (request.LowerBoundDiscountRate > request.UpperBoundDiscountRate)
            {
                throw new ArgumentException("Lower bound discount rate cannot be greater than the upper bound rate.");
            }

            for (var rate = request.LowerBoundDiscountRate; rate <= request.UpperBoundDiscountRate; rate += request.DiscountRateIncrement)
            {
                // To avoid floating point inaccuracies, we round the rate.
                var currentRate = Math.Round(rate, 4);

                var npv = CalculateNpv(request.CashFlows, currentRate);

                yield return new NpvResult { DiscountRate = currentRate, NetPresentValue = npv };

                // Simulate processing time for a better streaming experience on the frontend
                await Task.Delay(50);
            }
        }

        private double CalculateNpv(IEnumerable<double> cashFlows, double discountRate)
        {
            // Edge Case: If the discount rate is -100% (-1), the denominator (1+r) is 0.
            if (discountRate == -1.0)
            {
                return double.MaxValue;
            }

            var npv = 0.0;
            var period = 0;

            foreach (var cashFlow in cashFlows)
            {
                if (period == 0)
                {
                    // The first cash flow (C_0) at t=0 is not discounted.
                    npv += cashFlow;
                }
                else
                {
                    npv += cashFlow / Math.Pow(1 + discountRate, period);
                }
                period++;
            }
            return npv;
        }
    }
}
