using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sarve.Backend.Data.Repositories;
using Sarve.Backend.DTOs;
using Sarve.Backend.Models;
using System.Security.Claims;

namespace Sarve.Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskRepository _taskRepository;
        private readonly SectionRepository _sectionRepository;

        public TasksController(
            TaskRepository taskRepository,
            SectionRepository sectionRepository)
        {
            _taskRepository = taskRepository;
            _sectionRepository = sectionRepository;
        }

        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }

        private TaskDTO MapToDTO(TaskItem task)
        {
            return new TaskDTO
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Priority = task.Priority,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                Deadline = task.Deadline,
                CompletedAt = task.CompletedAt,
                IsCompleted = task.IsCompleted,
                SectionId = task.SectionId,
                LabelIds = task.LabelIds,
                GoalId = task.GoalId,
                TimeSpent = task.TimeSpent,
                AudioFilePath = task.AudioFilePath,
                Order = task.Order
            };
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var userId = GetUserId();
            var tasks = _taskRepository.GetByUserId(userId);
            var taskDtos = tasks.Select(MapToDTO).ToList();
            return Ok(taskDtos);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(string id)
        {
            var userId = GetUserId();
            var task = _taskRepository.GetById(id);

            if (task == null || task.UserId != userId)
            {
                return NotFound(new { message = "وظیفه یافت نشد." });
            }

            return Ok(MapToDTO(task));
        }

        [HttpGet("section/{sectionId}")]
        public IActionResult GetBySection(string sectionId)
        {
            var userId = GetUserId();
            var tasks = _taskRepository.GetBySection(userId, sectionId);
            var taskDtos = tasks.Select(MapToDTO).ToList();
            return Ok(taskDtos);
        }

        [HttpGet("today")]
        public IActionResult GetToday()
        {
            var userId = GetUserId();
            var tasks = _taskRepository.GetTodayTasks(userId);
            var taskDtos = tasks.Select(MapToDTO).ToList();
            return Ok(taskDtos);
        }

        [HttpGet("pending")]
        public IActionResult GetPending()
        {
            var userId = GetUserId();
            var tasks = _taskRepository.GetPending(userId);
            var taskDtos = tasks.Select(MapToDTO).ToList();
            return Ok(taskDtos);
        }

        [HttpGet("completed")]
        public IActionResult GetCompleted()
        {
            var userId = GetUserId();
            var tasks = _taskRepository.GetCompleted(userId);
            var taskDtos = tasks.Select(MapToDTO).ToList();
            return Ok(taskDtos);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateTaskRequest request)
        {
            var userId = GetUserId();

            // بررسی وجود سکشن
            var section = _sectionRepository.GetById(request.SectionId);
            if (section == null || section.UserId != userId)
            {
                return BadRequest(new { message = "سکشن معتبر نیست." });
            }

            var task = new TaskItem
            {
                UserId = userId,
                Title = request.Title.Trim(),
                Description = request.Description?.Trim(),
                Priority = request.Priority,
                Deadline = request.Deadline,
                SectionId = request.SectionId,
                LabelIds = request.LabelIds ?? new List<string>(),
                GoalId = request.GoalId,
                CreatedAt = DateTime.UtcNow
            };

            _taskRepository.Insert(task);

            return CreatedAtAction(nameof(GetById), new { id = task.Id }, MapToDTO(task));
        }

        [HttpPut("{id}")]
        public IActionResult Update(string id, [FromBody] UpdateTaskRequest request)
        {
            var userId = GetUserId();
            var task = _taskRepository.GetById(id);

            if (task == null || task.UserId != userId)
            {
                return NotFound(new { message = "وظیفه یافت نشد." });
            }

            // بروزرسانی فیلدها
            if (!string.IsNullOrWhiteSpace(request.Title))
            {
                task.Title = request.Title.Trim();
            }

            if (request.Description != null)
            {
                task.Description = request.Description.Trim();
            }

            if (request.Priority.HasValue)
            {
                task.Priority = request.Priority.Value;
            }

            if (request.Deadline.HasValue)
            {
                task.Deadline = request.Deadline;
            }

            if (!string.IsNullOrWhiteSpace(request.SectionId))
            {
                // بررسی وجود سکشن
                var section = _sectionRepository.GetById(request.SectionId);
                if (section == null || section.UserId != userId)
                {
                    return BadRequest(new { message = "سکشن معتبر نیست." });
                }
                task.SectionId = request.SectionId;
            }

            if (request.LabelIds != null)
            {
                task.LabelIds = request.LabelIds;
            }

            if (request.GoalId != null)
            {
                task.GoalId = request.GoalId;
            }

            if (request.Order.HasValue)
            {
                task.Order = request.Order.Value;
            }

            task.UpdatedAt = DateTime.UtcNow;
            _taskRepository.Update(task);

            return Ok(MapToDTO(task));
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var userId = GetUserId();
            var task = _taskRepository.GetById(id);

            if (task == null || task.UserId != userId)
            {
                return NotFound(new { message = "وظیفه یافت نشد." });
            }

            _taskRepository.Delete(id);

            return Ok(new { message = "وظیفه با موفقیت حذف شد." });
        }

        [HttpPatch("{id}/toggle")]
        public IActionResult ToggleComplete(string id)
        {
            var userId = GetUserId();
            var task = _taskRepository.GetById(id);

            if (task == null || task.UserId != userId)
            {
                return NotFound(new { message = "وظیفه یافت نشد." });
            }

            _taskRepository.ToggleComplete(id);
            var updatedTask = _taskRepository.GetById(id);

            return Ok(MapToDTO(updatedTask!));
        }

        [HttpPost("{id}/time")]
        public IActionResult SaveTime(string id, [FromBody] SaveTimeRequest request)
        {
            var userId = GetUserId();
            var task = _taskRepository.GetById(id);

            if (task == null || task.UserId != userId)
            {
                return NotFound(new { message = "وظیفه یافت نشد." });
            }

            _taskRepository.AddTimeSpent(id, request.Seconds);
            var updatedTask = _taskRepository.GetById(id);

            return Ok(MapToDTO(updatedTask!));
        }
    }
}
