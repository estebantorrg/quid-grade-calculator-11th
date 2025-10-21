function parseGrades() {
  const subjects = [];
  const rows = document.querySelectorAll('#tablaCalificaciones tbody tr');
  
  rows.forEach(row => {
    const nameCell = row.querySelector('td:first-child');
    const periodo4Cell = row.querySelector('td[data-periodo-id="828"]');
    
    if (!nameCell || !periodo4Cell) return;
    
    const subjectName = nameCell.querySelector('strong')?.textContent.trim() || nameCell.textContent.trim().split('\n')[0].trim();
    const teacher = nameCell.querySelector('.text-muted')?.textContent.trim();
    const button = periodo4Cell.querySelector('button');
    
    if (button && button.textContent.includes('Ver')) {
      const modalId = button.getAttribute('data-target');
      const modal = document.querySelector(modalId);
      
      if (modal) {
        const activities = [];
        const activityRows = modal.querySelectorAll('.modal-body table tbody tr');
        
        activityRows.forEach(actRow => {
          const actName = actRow.querySelector('td:first-child a')?.textContent.trim();
          const percentage = parseInt(actRow.querySelector('td:nth-child(2)')?.textContent || '0');
          const gradeCell = actRow.querySelector('td:nth-child(4) span');
          const grade = gradeCell ? parseFloat(gradeCell.textContent.trim()) : null;
          
          if (actName && percentage) {
            activities.push({ name: actName, percentage, grade });
          }
        });
        
        if (activities.length > 0) {
          subjects.push({ name: subjectName, teacher, activities });
        }
      }
    }
  });
  
  chrome.storage.local.set({ periodo4Grades: subjects });
  return subjects;
}

if (window.location.href.includes('/dashboard/estudiante/view')) {
  setTimeout(() => {
    parseGrades();
  }, 1000);
}