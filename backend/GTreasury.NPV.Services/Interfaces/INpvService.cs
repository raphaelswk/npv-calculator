using GTreasury.NPV.Domain;

namespace GTreasury.NPV.Services.Interfaces
{
    public interface INpvService
    {
        IAsyncEnumerable<NpvResult> CalculateNpvRangeAsync(CalculationRequest request);
    }
}
