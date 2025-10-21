function calculateGrade(activities) {
  let totalPoints = 0;
  let totalPercentage = 0;

  activities.forEach(activity => {
    if (activity.grade !== null && !isNaN(activity.grade)) {
      totalPoints += (activity.grade * activity.percentage) / 100;
      totalPercentage += activity.percentage;
    }
  });

  if (totalPercentage === 0) return null;

  const current = totalPoints / (totalPercentage / 100);
  const projected = totalPoints;
  const remaining = 100 - totalPercentage;
  const pointsNeeded = 3.5 - totalPoints;
  const neededToPass = remaining > 0 ? pointsNeeded / (remaining / 100) : null;

  return {
    current,
    projected,
    completed: totalPercentage,
    remaining,
    neededToPass: neededToPass !== null ? Math.max(0, neededToPass) : null
  };
}

function displayGrades(subjects) {
  const container = document.getElementById('subjects');
  
  if (!subjects || subjects.length === 0) {
    container.innerHTML = '<div class="no-data">No hay datos disponibles. Ve a la página de calificaciones.</div>';
    return;
  }

  const subjectsWithCalcs = subjects
    .map(subject => ({
      ...subject,
      calculation: calculateGrade(subject.activities)
    }))
    .filter(s => s.calculation !== null);

  const subjectsWithoutGrades = subjects.filter(s => calculateGrade(s.activities) === null);

  if (subjectsWithCalcs.length === 0) {
    container.innerHTML = '<div class="no-data">No hay materias con notas aún.</div>';
    return;
  }

  const overallAvg = subjectsWithCalcs.reduce((sum, s) => sum + s.calculation.current, 0) / subjectsWithCalcs.length;
  document.getElementById('overallGrade').textContent = overallAvg.toFixed(2);
  document.getElementById('subjectCount').textContent = subjectsWithCalcs.length;

  let html = subjectsWithCalcs.map(subject => {
    const calc = subject.calculation;
    const needsClass = calc.neededToPass <= 5 ? '' : 'danger';
    
    return `
      <div class="subject">
        <div class="subject-name">${subject.name}</div>
        <div class="teacher">${subject.teacher || ''}</div>
        <div class="stats">
          <div class="stat stat-current">
            <div class="stat-label">Actual</div>
            <div class="stat-value">${calc.current.toFixed(2)}</div>
          </div>
          <div class="stat stat-projected">
            <div class="stat-label">Peor Caso</div>
            <div class="stat-value">${calc.projected.toFixed(2)}</div>
          </div>
          <div class="stat stat-remaining">
            <div class="stat-label">Pendiente</div>
            <div class="stat-value">${calc.remaining}%</div>
          </div>
          <div class="stat stat-needed ${needsClass}">
            <div class="stat-label">Para 3.5</div>
            <div class="stat-value">${calc.neededToPass ? calc.neededToPass.toFixed(1) : '✓'}</div>
          </div>
        </div>
        <div class="activities">
          ${subject.activities.map(act => `
            <div class="activity">
              <span class="activity-name">${act.name}</span>
              <span class="activity-percent">${act.percentage}%</span>
              <span class="activity-grade ${act.grade !== null ? 'done' : 'pending'}">
                ${act.grade !== null ? act.grade.toFixed(1) : '-'}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  if (subjectsWithoutGrades.length > 0) {
    html += `
      <div style="margin-top: 16px; padding: 12px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px;">
        <div style="font-weight: bold; font-size: 12px; color: #856404; margin-bottom: 8px;">
          ⚠️ Materias sin notas (no incluidas en el promedio):
        </div>
        <div style="font-size: 11px; color: #856404;">
          ${subjectsWithoutGrades.map(s => `• ${s.name}`).join('<br>')}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

chrome.storage.local.get(['periodo4Grades'], function(result) {
  if (result.periodo4Grades) {
    displayGrades(result.periodo4Grades);
  }
});

document.getElementById('refreshBtn').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "refreshGrades"}, function(response) {
        if (chrome.runtime.lastError) {
          // Ignore error, just reload from storage
          console.log('Could not send message to tab, reloading from storage');
        }
        setTimeout(() => {
          chrome.storage.local.get(['periodo4Grades'], function(result) {
            displayGrades(result.periodo4Grades);
          });
        }, 500);
      });
    }
  });
});