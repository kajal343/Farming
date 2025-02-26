async function fetchMarketPrices() {
    const state = document.getElementById("state").value;
    const district = document.getElementById("district").value.trim();
    const crop = document.getElementById("crop").value.trim();
    const tableHeading = document.getElementById("tableHeading");
    const stateColumn = document.getElementById("stateColumn"); // Get State column header
    const priceTable = document.getElementById("priceTable");

    if (!state) {
        alert("Please select a state.");
        return;
    }

    const apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001c428ce76652548145c213fbe4a9e73ad&format=json&limit=1000`;

    try {
        console.log("Fetching data from API:", apiUrl);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (!data.records || data.records.length === 0) {
            console.log("No records found.");
            tableHeading.innerText = "No Data Available";
            priceTable.innerHTML = "<tr><td colspan='8'>No data available.</td></tr>";
            return;
        }

        // **Filter by State**
        let filteredData = data.records.filter(item => item.state === state);

        // **Filter by District**
        if (district) {
            filteredData = filteredData.filter(item => item.district.toLowerCase().includes(district.toLowerCase()));
        }

        // **Filter by Crop**
        if (crop) {
            filteredData = filteredData.filter(item => item.commodity.toLowerCase().includes(crop.toLowerCase()));
        }

        priceTable.innerHTML = ""; // Clear previous results

        // **Set Dynamic Heading Above Table**
        if (crop && district) {
            tableHeading.innerText = `${crop} Prices in ${district}, ${state}`;
        } else if (district) {
            tableHeading.innerText = `Market Prices in ${district}, ${state}`;
        } else if (crop) {
            tableHeading.innerText = `${crop} Prices in ${state}`;
        } else {
            tableHeading.innerText = `Market Prices in ${state}`;
        }

        // ✅ **Fix: Only Hide "State" Column If It Exists**
        if (stateColumn) {
            stateColumn.style.display = "none"; // Hide state column
        } else {
            console.warn("stateColumn element not found!");
        }

        if (filteredData.length === 0) {
            console.log("No matching data found.");
            priceTable.innerHTML = "<tr><td colspan='8'>No data available for this selection.</td></tr>";
        } else {
            console.log("Displaying", filteredData.length, "records.");
            filteredData.forEach(item => {
                const row = `<tr>
                    <td>${item.district || 'N/A'}</td>
                    <td>${item.market || 'N/A'}</td>
                    <td>${item.commodity || 'N/A'}</td>
                    <td>${item.variety || 'N/A'}</td>
                    <td>${item.min_price || 'N/A'}</td>
                    <td>${item.max_price || 'N/A'}</td>
                    <td>${item.modal_price || 'N/A'}</td>
                    <td>${item.arrival_date || 'N/A'}</td>
                </tr>`;
                priceTable.innerHTML += row;
            });
            
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        priceTable.innerHTML = "<tr><td colspan='8'>Failed to load market prices. Please try again later.</td></tr>";
        tableHeading.innerText = "Error Fetching Data";
    }
}
