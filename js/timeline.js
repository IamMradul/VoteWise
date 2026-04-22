document.addEventListener('DOMContentLoaded', () => {
    const timelineSteps = document.querySelectorAll('.timeline-step');

    timelineSteps.forEach(step => {
        step.addEventListener('click', () => {
            const isExpanded = step.getAttribute('aria-expanded') === 'true';
            
            // Close all other steps
            timelineSteps.forEach(otherStep => {
                otherStep.setAttribute('aria-expanded', 'false');
                const otherDetailId = otherStep.getAttribute('aria-controls');
                document.getElementById(otherDetailId).hidden = true;
            });

            if (!isExpanded) {
                // Open this step
                step.setAttribute('aria-expanded', 'true');
                const detailId = step.getAttribute('aria-controls');
                document.getElementById(detailId).hidden = false;
            }
        });
        
        // Add keyboard support for accessibility
        step.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                step.click();
            }
        });
    });
});
