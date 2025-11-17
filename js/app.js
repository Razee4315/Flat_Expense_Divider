document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const expenseForm = document.getElementById('expenseForm');
    const amountInput = document.getElementById('amount');
    const descriptionInput = document.getElementById('description');
    const expenseTable = document.getElementById('expenseTable');
    const noExpenses = document.getElementById('noExpenses');
    const summaryBtn = document.getElementById('summaryBtn');
    const closeSummary = document.getElementById('closeSummary');
    const clearBtn = document.getElementById('clearBtn');
    const summarySection = document.getElementById('summarySection');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeModal = document.getElementById('closeModal');
    const saveSettings = document.getElementById('saveSettings');
    const payerOptions = document.getElementById('payerOptions');
    const splitOptions = document.getElementById('splitOptions');
    const individualSpending = document.getElementById('individualSpending');
    const importBtn = document.getElementById('importBtn');
    const exportBtn = document.getElementById('exportBtn');
    const fileInput = document.getElementById('csvFileInput');
    const addPersonBtn = document.getElementById('addPersonBtn');
    const flatmatesList = document.getElementById('flatmatesList');
    
    // Initialize flatmates data from localStorage or default values
    let flatmates = JSON.parse(localStorage.getItem('flatmateNames')) || [
        { id: Date.now() + 1, name: "Ali", active: true },
        { id: Date.now() + 2, name: "Saqlain", active: true },
        { id: Date.now() + 3, name: "Waqar", active: true },
        { id: Date.now() + 4, name: "Tatheer", active: true },
        { id: Date.now() + 5, name: "Imran", active: true }
    ];
    
    let nextId = flatmates.length > 0 ? Math.max(...flatmates.map(f => f.id)) + 1 : 1;
    
    // Initialize expenses array from localStorage or empty array
    let expenses = JSON.parse(localStorage.getItem('flatmateExpenses')) || [];
    
    // Render flatmates list in settings modal
    function renderFlatmatesList() {
        flatmatesList.innerHTML = '';
        
        flatmates.forEach((person, index) => {
            const item = document.createElement('div');
            item.className = 'flatmate-item';
            item.innerHTML = `
                <div class="flatmate-number">${index + 1}</div>
                <input type="text" 
                       class="input-field flatmate-input" 
                       value="${person.name}" 
                       placeholder="Enter name"
                       data-id="${person.id}">
                <button class="btn btn-danger btn-icon-only" 
                        onclick="removePerson(${person.id})"
                        ${flatmates.length <= 2 ? 'disabled title="Minimum 2 people required"' : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </button>
            `;
            flatmatesList.appendChild(item);
        });
    }
    
    // Add new person
    addPersonBtn.addEventListener('click', function() {
        const newPerson = {
            id: nextId++,
            name: `Person ${flatmates.length + 1}`,
            active: true
        };
        flatmates.push(newPerson);
        renderFlatmatesList();
    });
    
    // Remove person (global function for inline onclick)
    window.removePerson = function(id) {
        if (flatmates.length <= 2) {
            alert('You must have at least 2 flatmates!');
            return;
        }
        
        const person = flatmates.find(f => f.id === id);
        if (confirm(`Remove ${person.name} from the list?`)) {
            flatmates = flatmates.filter(f => f.id !== id);
            renderFlatmatesList();
        }
    };
    
    // Save settings from modal
    function saveFlatmateNames() {
        // Update names from input fields
        const inputs = document.querySelectorAll('.flatmate-input');
        inputs.forEach(input => {
            const id = parseInt(input.dataset.id);
            const person = flatmates.find(f => f.id === id);
            if (person) {
                person.name = input.value.trim() || `Person ${flatmates.indexOf(person) + 1}`;
            }
        });
        
        localStorage.setItem('flatmateNames', JSON.stringify(flatmates));
        renderPayerOptions();
        renderSplitOptions();
        renderExpenses();
    }
    
    // Render payer options
    function renderPayerOptions() {
        payerOptions.innerHTML = '';
        
        flatmates.forEach((person, index) => {
            const radioId = `person${index + 1}`;
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.id = radioId;
            radio.name = 'payer';
            radio.value = person.name;
            radio.className = 'radio-option';
            if (index === 0) radio.checked = true;
            
            const label = document.createElement('label');
            label.htmlFor = radioId;
            label.className = 'radio-label';
            label.textContent = person.name;
            
            payerOptions.appendChild(radio);
            payerOptions.appendChild(label);
        });
    }
    
    // Render split options
    function renderSplitOptions() {
        splitOptions.innerHTML = '';
        
        flatmates.forEach((person, index) => {
            const checkboxId = `splitPerson${index + 1}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = checkboxId;
            checkbox.name = 'split';
            checkbox.value = person.name;
            checkbox.className = 'checkbox-option';
            checkbox.checked = true;
            
            const label = document.createElement('label');
            label.htmlFor = checkboxId;
            label.className = 'checkbox-label';
            label.textContent = person.name;
            
            splitOptions.appendChild(checkbox);
            splitOptions.appendChild(label);
        });
    }
    
    // Render expenses table
    function renderExpenses() {
        expenseTable.innerHTML = '';
        
        if (expenses.length === 0) {
            noExpenses.classList.remove('hidden');
            return;
        }
        
        noExpenses.classList.add('hidden');
        
        expenses.forEach((expense, index) => {
            const row = document.createElement('tr');
            row.className = 'table-row';
            
            // Date cell
            const dateCell = document.createElement('td');
            const dateSpan = document.createElement('span');
            dateSpan.className = 'expense-date';
            dateSpan.textContent = new Date(expense.date).toLocaleDateString();
            dateCell.appendChild(dateSpan);
            
            // Description cell
            const descriptionCell = document.createElement('td');
            const descSpan = document.createElement('span');
            descSpan.className = 'expense-description';
            descSpan.textContent = expense.description || '-';
            descriptionCell.appendChild(descSpan);
            
            // Amount cell
            const amountCell = document.createElement('td');
            const amountSpan = document.createElement('span');
            amountSpan.className = 'expense-amount';
            amountSpan.textContent = `Rs ${expense.amount.toFixed(2)}`;
            amountCell.appendChild(amountSpan);
            
            // Payer cell
            const payerCell = document.createElement('td');
            const payerBadge = document.createElement('span');
            payerBadge.className = 'expense-person';
            payerBadge.textContent = expense.payer;
            payerCell.appendChild(payerBadge);
            
            // Split between cell
            const splitCell = document.createElement('td');
            const splitContainer = document.createElement('div');
            splitContainer.className = 'expense-split';
            expense.splitBetween.forEach(person => {
                const personBadge = document.createElement('span');
                personBadge.className = 'expense-split-person';
                personBadge.textContent = person;
                splitContainer.appendChild(personBadge);
            });
            splitCell.appendChild(splitContainer);
            
            // Actions cell
            const actionsCell = document.createElement('td');
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'expense-actions';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteExpense(index));
            
            actionsDiv.appendChild(deleteBtn);
            actionsCell.appendChild(actionsDiv);
            
            row.appendChild(dateCell);
            row.appendChild(descriptionCell);
            row.appendChild(amountCell);
            row.appendChild(payerCell);
            row.appendChild(splitCell);
            row.appendChild(actionsCell);
            
            expenseTable.appendChild(row);
        });
    }
    
    // Add new expense
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = parseFloat(amountInput.value);
        const description = descriptionInput.value.trim();
        const payer = document.querySelector('input[name="payer"]:checked').value;
        
        // Get which flatmates to split between
        const splitCheckboxes = document.querySelectorAll('input[name="split"]:checked');
        const splitBetween = Array.from(splitCheckboxes).map(cb => cb.value);
        
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        if (splitBetween.length === 0) {
            alert('Please select at least one person to split the expense with');
            return;
        }
        
        const newExpense = {
            amount: amount,
            description: description,
            payer: payer,
            splitBetween: splitBetween,
            date: new Date().toISOString()
        };
        
        expenses.push(newExpense);
        saveExpenses();
        renderExpenses();
        
        // Reset form
        amountInput.value = '';
        descriptionInput.value = '';
        amountInput.focus();
    });
    
    // Delete expense
    function deleteExpense(index) {
        if (confirm('Are you sure you want to delete this expense?')) {
            expenses.splice(index, 1);
            saveExpenses();
            renderExpenses();
            
            // Hide summary if visible
            summarySection.classList.add('hidden');
        }
    }
    
    // Show summary
    summaryBtn.addEventListener('click', function() {
        if (expenses.length === 0) {
            alert('No expenses to summarize');
            return;
        }
        
        calculateSummary();
        summarySection.classList.remove('hidden');
        
        // Scroll to summary section
        summarySection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Close summary
    closeSummary.addEventListener('click', function() {
        summarySection.classList.add('hidden');
        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Calculate and display summary
    function calculateSummary() {
        // Calculate totals and participation counts
        let totalExpenses = 0;
        const participantTotals = {}; // How much each person paid
        const participantShares = {}; // How much each person should pay
        
        // Initialize participant data
        flatmates.forEach(person => {
            participantTotals[person.name] = 0;
            participantShares[person.name] = 0;
        });
        
        // Process each expense
        expenses.forEach(expense => {
            totalExpenses += expense.amount;
            
            // Add to payer's total
            participantTotals[expense.payer] += expense.amount;
            
            // Calculate each participant's share for this expense
            const perPersonShare = expense.amount / expense.splitBetween.length;
            
            // Add to each participant's total share
            expense.splitBetween.forEach(person => {
                participantShares[person] = (participantShares[person] || 0) + perPersonShare;
            });
        });
        
        // Calculate total participants (unique people involved in expenses)
        const involvedParticipants = new Set();
        expenses.forEach(expense => {
            involvedParticipants.add(expense.payer);
            expense.splitBetween.forEach(person => involvedParticipants.add(person));
        });
        const totalParticipants = involvedParticipants.size;
        
        // Update summary display
        document.getElementById('totalExpenses').textContent = `Rs ${totalExpenses.toFixed(2)}`;
        document.getElementById('totalParticipants').textContent = totalParticipants;
        
        // Render individual spending with separate boxes
        individualSpending.innerHTML = '';
        
        flatmates.forEach(person => {
            const name = person.name;
            const spent = participantTotals[name] || 0;
            const shouldPay = participantShares[name] || 0;
            const balance = spent - shouldPay;
            
            // Skip if person wasn't involved in any expenses
            if (spent === 0 && shouldPay === 0) return;
            
            // Create person box
            const personBox = document.createElement('div');
            personBox.className = 'person-spending-box';
            
            // Person name header
            const nameHeader = document.createElement('div');
            nameHeader.className = 'person-name-header';
            nameHeader.textContent = name;
            personBox.appendChild(nameHeader);
            
            // Spent row
            const spentRow = document.createElement('div');
            spentRow.className = 'spending-row';
            spentRow.innerHTML = `
                <span class="spending-label">Total Spent:</span>
                <span class="spending-value">Rs ${spent.toFixed(2)}</span>
            `;
            personBox.appendChild(spentRow);
            
            // Should pay row
            const shouldPayRow = document.createElement('div');
            shouldPayRow.className = 'spending-row';
            shouldPayRow.innerHTML = `
                <span class="spending-label">Should Pay:</span>
                <span class="spending-value">Rs ${shouldPay.toFixed(2)}</span>
            `;
            personBox.appendChild(shouldPayRow);
            
            // Balance section
            const balanceSection = document.createElement('div');
            balanceSection.className = 'balance-section';
            
            const balanceText = document.createElement('div');
            balanceText.className = 'balance-text';
            
            if (balance > 0.01) {
                balanceText.textContent = `Is owed Rs ${balance.toFixed(2)} by others`;
                balanceText.className += ' balance-positive';
            } else if (balance < -0.01) {
                balanceText.textContent = `Owes Rs ${Math.abs(balance).toFixed(2)} to others`;
                balanceText.className += ' balance-negative';
            } else {
                balanceText.textContent = 'Balanced ✓';
                balanceText.className += ' balance-neutral';
            }
            
            balanceSection.appendChild(balanceText);
            personBox.appendChild(balanceSection);
            
            individualSpending.appendChild(personBox);
        });
        
        // Generate settlements
        const settlementsContainer = document.getElementById('settlements');
        settlementsContainer.innerHTML = '';
        
        if (totalParticipants === 0) {
            const noSettlements = document.createElement('div');
            noSettlements.className = 'text-center text-slate-400 py-2';
            noSettlements.textContent = 'No expenses to settle';
            settlementsContainer.appendChild(noSettlements);
            return;
        }
        
        // Calculate balances for each person
        const balances = [];
        
        flatmates.forEach(person => {
            const name = person.name;
            const spent = participantTotals[name] || 0;
            const shouldPay = participantShares[name] || 0;
            
            // Only include if they were involved in expenses
            if (spent > 0 || shouldPay > 0) {
                balances.push({
                    name: name,
                    balance: spent - shouldPay
                });
            }
        });
        
        // Sort by balance (positive first)
        balances.sort((a, b) => b.balance - a.balance);
        
        // Generate settlement instructions
        const creditors = balances.filter(p => p.balance > 0.01);
        const debtors = balances.filter(p => p.balance < -0.01).map(p => ({ ...p, balance: Math.abs(p.balance) }));
        
        let i = 0, j = 0;
        
        while (i < creditors.length && j < debtors.length) {
            const creditor = creditors[i];
            const debtor = debtors[j];
            
            const amount = Math.min(creditor.balance, debtor.balance);
            
            if (amount > 0.01) { // Only show if amount is significant
                const settlementItem = document.createElement('div');
                settlementItem.className = 'summary-item';
                
                const settlementText = document.createElement('div');
                settlementText.className = 'flex justify-between';
                
                const fromText = document.createElement('span');
                fromText.textContent = `${debtor.name} → ${creditor.name}:`;
                
                const amountText = document.createElement('span');
                amountText.className = 'font-medium';
                amountText.textContent = `Rs ${amount.toFixed(2)}`;
                
                settlementText.appendChild(fromText);
                settlementText.appendChild(amountText);
                settlementItem.appendChild(settlementText);
                settlementsContainer.appendChild(settlementItem);
            }
            
            creditor.balance -= amount;
            debtor.balance -= amount;
            
            if (creditor.balance < 0.01) i++;
            if (debtor.balance < 0.01) j++;
        }
        
        if (settlementsContainer.children.length === 0) {
            const noSettlements = document.createElement('div');
            noSettlements.className = 'text-center text-slate-400 py-2';
            noSettlements.textContent = 'No settlements needed - everything is balanced!';
            settlementsContainer.appendChild(noSettlements);
        }
    }
    
    // Clear all expenses
    clearBtn.addEventListener('click', function() {
        if (expenses.length === 0 || confirm('Are you sure you want to delete ALL expenses?')) {
            expenses = [];
            saveExpenses();
            renderExpenses();
            summarySection.classList.add('hidden');
        }
    });
    
    // Save expenses to localStorage
    function saveExpenses() {
        localStorage.setItem('flatmateExpenses', JSON.stringify(expenses));
    }
    
    // Modal controls
    settingsBtn.addEventListener('click', function() {
        renderFlatmatesList();
        settingsModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });
    
    saveSettings.addEventListener('click', function() {
        saveFlatmateNames();
        settingsModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    
    // CSV Import functionality
    importBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const csvData = e.target.result;
                const importedExpenses = parseCSV(csvData);
                
                if (importedExpenses.length > 0) {
                    if (confirm(`Import ${importedExpenses.length} expenses?`)) {
                        expenses = [...expenses, ...importedExpenses];
                        saveExpenses();
                        renderExpenses();
                        alert(`Successfully imported ${importedExpenses.length} expenses.`);
                    }
                } else {
                    alert('No valid expenses found in the CSV file.');
                }
            } catch (error) {
                console.error('Error parsing CSV:', error);
                alert('Error importing CSV. Please check the file format.');
            }
            
            // Reset file input
            fileInput.value = '';
        };
        reader.readAsText(file);
    });
    
    function parseCSV(csvText) {
        const lines = csvText.split('\n');
        const result = [];
        
        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const columns = line.split(',');
            if (columns.length < 4) continue;
            
            try {
                const date = columns[0].trim();
                const description = columns[1].trim();
                const amount = parseFloat(columns[2].trim());
                const payer = columns[3].trim();
                const splitBetween = columns[4].trim().split(';').map(name => name.trim());
                
                if (isNaN(amount) || amount <= 0) continue;
                
                result.push({
                    date: new Date(date).toISOString(),
                    description: description,
                    amount: amount,
                    payer: payer,
                    splitBetween: splitBetween
                });
            } catch (e) {
                console.error('Error parsing line:', line, e);
            }
        }
        
        return result;
    }
    
    // CSV Export functionality
    exportBtn.addEventListener('click', function() {
        if (expenses.length === 0) {
            alert('No expenses to export');
            return;
        }
        
        const csvContent = generateCSV();
        downloadCSV(csvContent, 'flatmate_expenses.csv');
    });
    
    function generateCSV() {
        // CSV Header
        let csv = 'Date,Description,Amount,Payer,SplitBetween\n';
        
        // Add each expense as a row
        expenses.forEach(expense => {
            const date = new Date(expense.date).toLocaleDateString();
            const description = expense.description || '';
            const amount = expense.amount.toFixed(2);
            const payer = expense.payer;
            const splitBetween = expense.splitBetween.join(';');
            
            // Escape fields that might contain commas
            const escapedDescription = `"${description.replace(/"/g, '""')}"`;
            
            csv += `${date},${escapedDescription},${amount},${payer},${splitBetween}\n`;
        });
        
        return csv;
    }
    
    function downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        // Create a URL for the blob
        const url = URL.createObjectURL(blob);
        
        // Set link properties
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        // Add to document, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Initial render
    renderPayerOptions();
    renderSplitOptions();
    renderExpenses();
});
// Updated on Sun Apr  6 09:45:56 PM PKT 2025
