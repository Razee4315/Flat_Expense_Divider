document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const expenseForm = document.getElementById('expenseForm');
    const amountInput = document.getElementById('amount');
    const descriptionInput = document.getElementById('description');
    const expenseTable = document.getElementById('expenseTable');
    const noExpenses = document.getElementById('noExpenses');
    const summaryBtn = document.getElementById('summaryBtn');
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
    
    // Initialize flatmates data from localStorage or default values
    let flatmates = JSON.parse(localStorage.getItem('flatmateNames')) || [
        { id: 1, name: "Person A", active: true },
        { id: 2, name: "Person B", active: true },
        { id: 3, name: "Person C", active: true },
        { id: 4, name: "Person D", active: true }
    ];
    
    // Initialize expenses array from localStorage or empty array
    let expenses = JSON.parse(localStorage.getItem('flatmateExpenses')) || [];
    
    // Load settings into modal inputs
    function loadSettings() {
        document.getElementById('person1Name').value = flatmates[0].name;
        document.getElementById('person2Name').value = flatmates[1].name;
        document.getElementById('person3Name').value = flatmates[2].name;
        document.getElementById('person4Name').value = flatmates[3].name;
    }
    
    // Save settings from modal
    function saveFlatmateNames() {
        flatmates[0].name = document.getElementById('person1Name').value || "Person A";
        flatmates[1].name = document.getElementById('person2Name').value || "Person B";
        flatmates[2].name = document.getElementById('person3Name').value || "Person C";
        flatmates[3].name = document.getElementById('person4Name').value || "Person D";
        
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
            
            const dateCell = document.createElement('td');
            dateCell.className = 'py-3 px-4';
            dateCell.textContent = new Date(expense.date).toLocaleDateString();
            
            const descriptionCell = document.createElement('td');
            descriptionCell.className = 'py-3 px-4';
            descriptionCell.textContent = expense.description || '-';
            
            const amountCell = document.createElement('td');
            amountCell.className = 'py-3 px-4';
            amountCell.textContent = `$${expense.amount.toFixed(2)}`;
            
            const payerCell = document.createElement('td');
            payerCell.className = 'py-3 px-4';
            payerCell.textContent = expense.payer;
            
            const splitCell = document.createElement('td');
            splitCell.className = 'py-3 px-4 text-sm';
            splitCell.textContent = expense.splitBetween.join(', ');
            
            const actionsCell = document.createElement('td');
            actionsCell.className = 'py-3 px-4';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-red-400 hover:text-red-300 text-sm';
            deleteBtn.innerHTML = 'Delete';
            deleteBtn.addEventListener('click', () => deleteExpense(index));
            
            actionsCell.appendChild(deleteBtn);
            
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
        document.getElementById('totalExpenses').textContent = `$${totalExpenses.toFixed(2)}`;
        document.getElementById('totalParticipants').textContent = totalParticipants;
        
        // Render individual spending
        individualSpending.innerHTML = '';
        
        flatmates.forEach(person => {
            const name = person.name;
            const spent = participantTotals[name] || 0;
            const shouldPay = participantShares[name] || 0;
            const balance = spent - shouldPay;
            
            // Skip if person wasn't involved in any expenses
            if (spent === 0 && shouldPay === 0) return;
            
            const item = document.createElement('div');
            item.className = 'summary-item';
            
            const content = document.createElement('div');
            content.className = 'flex justify-between';
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = `${name} spent:`;
            
            const amountSpan = document.createElement('span');
            amountSpan.className = 'font-medium';
            amountSpan.textContent = `$${spent.toFixed(2)}`;
            
            content.appendChild(nameSpan);
            content.appendChild(amountSpan);
            item.appendChild(content);
            
            // Add share info
            const shareDiv = document.createElement('div');
            shareDiv.className = 'text-xs mt-1';
            shareDiv.textContent = `Should pay: $${shouldPay.toFixed(2)}`;
            item.appendChild(shareDiv);
            
            // Add balance info
            const balanceDiv = document.createElement('div');
            balanceDiv.className = 'text-xs mt-1';
            
            if (balance > 0.01) {
                balanceDiv.textContent = `Is owed $${balance.toFixed(2)} by others`;
                balanceDiv.className += ' text-green-300';
            } else if (balance < -0.01) {
                balanceDiv.textContent = `Owes $${Math.abs(balance).toFixed(2)} to others`;
                balanceDiv.className += ' text-red-300';
            } else {
                balanceDiv.textContent = 'Balanced (no payments needed)';
                balanceDiv.className += ' text-blue-300';
            }
            
            item.appendChild(balanceDiv);
            individualSpending.appendChild(item);
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
                amountText.textContent = `$${amount.toFixed(2)}`;
                
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
        loadSettings();
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
