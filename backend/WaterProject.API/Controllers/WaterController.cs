using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WaterProject.API.Data;

namespace WaterProject.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WaterController : ControllerBase
    {
        private WaterDbContext _waterContext;
        public WaterController(WaterDbContext temp)
        {
            _waterContext = temp;
        }
        
        [HttpGet("AllProjects")]
        public IActionResult Get(int pageHowMany = 10, int pageNum = 15,  [FromQuery] List<string>? projectTypes = null)
        {
            IQueryable<Project> query = _waterContext.Projects.AsQueryable();

            if (projectTypes != null && projectTypes.Any())
            {
                query = query.Where(p => projectTypes.Contains(p.ProjectType));
            }
            
            HttpContext.Response.Cookies.Append("FavoriteProjectType", "Borehole Well and Hand Pump", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.Now.AddMinutes(5),
                
            });
            
            string? favProjectType = Request.Cookies["FavoriteProjectType"];
            
            if (string.IsNullOrEmpty(favProjectType))
            {
                Console.WriteLine("-----Cookie----- \n No cookie found.");
            }
            else
            {
                Console.WriteLine("-----Cookie----- \n" + favProjectType);
            }
            var something = query
                .Skip((pageNum -1) * pageHowMany)
                .Take(pageHowMany)
                .ToList();
            
            var totalNumber = query.Count();
            
            return Ok(new
            {
                Projects = something,
                TotalNumber = totalNumber
            });
        }

        [HttpGet("GetProjectTypes")]
        public IActionResult GetProjectTypes()
        {
            var projectTypes = _waterContext.Projects
                .Select(p => p.ProjectType)
                .Distinct()
                .ToList();
            return Ok(projectTypes);
        }
    }
}
