using GTreasury.NPV.Domain;
using GTreasury.NPV.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GTreasury.NPV.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NpvController : ControllerBase
    {

        private readonly INpvService _npvService;

        public NpvController(INpvService npvService)
        {
            _npvService = npvService;
        }

        [HttpPost("calculate")]
        public IAsyncEnumerable<NpvResult> CalculateNpv([FromBody] CalculationRequest request)
        {
            // The service returns an IAsyncEnumerable, which ASP.NET Core
            // will automatically handle as a streaming response (e.g., application/x-ndjson).
            // This is efficient and perfect for progressive data loading on the frontend.
            return _npvService.CalculateNpvRangeAsync(request);
        }
    }
}
