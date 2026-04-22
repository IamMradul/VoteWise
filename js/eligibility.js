if (typeof document !== 'undefined') {
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('eligibility-form');
    const resultDiv = document.getElementById('eligibility-result');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Sanitize and validate inputs
        const ageInput = parseInt(document.getElementById('age').value, 10);
        const isCitizen = form.querySelector('input[name="citizenship"]:checked')?.value;
        const isResident = form.querySelector('input[name="resident"]:checked')?.value;

        if (isNaN(ageInput) || ageInput <= 0) {
            showResult('Please enter a valid age.', false);
            return;
        }

        if (!isCitizen || !isResident) {
            showResult('Please answer all questions.', false);
            return;
        }

        // 2. Evaluate rules
        const rulesPassed = evaluateEligibility(ageInput, isCitizen === 'yes', isResident === 'yes');

        // 3. Display result
        if (rulesPassed) {
            showResult(
                'You are eligible to vote! <br><br> <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer" style="color: var(--color-saffron); font-weight: bold;">Register now at voters.eci.gov.in</a>', 
                true
            );
        } else {
            let reason = [];
            if (ageInput < 18) reason.push('must be at least 18 years old');
            if (isCitizen !== 'yes') reason.push('must be an Indian citizen');
            if (isResident !== 'yes') reason.push('must be an ordinary resident');
            
            showResult('You are not eligible yet. You ' + reason.join(' and ') + '.', false);
        }
    });

    function showResult(message, isEligible) {
        resultDiv.innerHTML = message;
        resultDiv.style.color = isEligible ? 'var(--color-green)' : '#D32F2F';
        resultDiv.style.fontWeight = 'bold';
        resultDiv.style.padding = '1rem';
        resultDiv.style.border = `2px solid ${isEligible ? 'var(--color-green)' : '#D32F2F'}`;
        resultDiv.style.borderRadius = '4px';
        resultDiv.hidden = false;
    }
});
}

// Extracted logic for testing purposes (CommonJS / Browser compatible)
function evaluateEligibility(age, isCitizen, isResident) {
    return age >= 18 && isCitizen && isResident;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { evaluateEligibility };
}
