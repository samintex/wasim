/* =========================================================
   YARN MANAGEMENT SYSTEM
   COMPLETE JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. DATABASE / LOCAL STORAGE
   ========================================================= */

let companies = JSON.parse(
    localStorage.getItem("companies")
) || [];

let orders = JSON.parse(
    localStorage.getItem("orders")
) || [];

let deliveries = JSON.parse(
    localStorage.getItem("deliveries")
) || [];


/* =========================================================
   2. YARN COUNT LIST
   ========================================================= */

const yarnCounts = [
    "10 KH",
    "12 KH",
    "16 KH",
    "20 KH",
    "22 KH",
    "24 KH",
    "26 KH",
    "28 KH",
    "30 KH",
    "32 KH",
    "34 KH",
    "36 KH",
    "40 KH",
    "53 KH",
    "60 KH",
    "80 KH",

    "20 COM",
    "24 COM",
    "26 COM",
    "28 COM",
    "30 COM",
    "32 COM",
    "34 COM",
    "36 COM",
    "40 COM",
    "53 COM",
    "60 COM",
    "80 COM"
];


/* =========================================================
   3. PAGE SHOW / HIDE
   ========================================================= */

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(function(page) {

        page.classList.add("hidden");

    });


    const page =
        document.getElementById(pageId);


    if (!page) {
        return;
    }


    page.classList.remove("hidden");


    /* ---------------- ORDER PAGE ---------------- */

    if (pageId === "orderPage") {

        updateCompanyDropdown("orderCompany");

        calculateOrderTotal();

    }


    /* ---------------- DELIVERY PAGE ---------------- */

    if (pageId === "deliveryPage") {

        updateCompanyDropdown("deliveryCompany");

        updateDeliveryFields();

        calculateDeliveryTotal();

    }


    /* ---------------- DUE PAGE ---------------- */

    if (pageId === "duePage") {

        renderDueList();

    }

}


/* =========================================================
   4. COMPANY DROPDOWN
   ========================================================= */

function updateCompanyDropdown(selectId) {

    const select =
        document.getElementById(selectId);


    if (!select) {
        return;
    }


    select.innerHTML =
        '<option value="">Select Company</option>';


    companies.forEach(function(company) {

        const option =
            document.createElement("option");


        option.value =
            company.id;


        option.textContent =
            company.name;


        select.appendChild(option);

    });

}


/* =========================================================
   5. SAVE COMPANY
   ========================================================= */

function saveCompany() {

    const name =
        document.getElementById("companyName")
        .value
        .trim();


    const address =
        document.getElementById("companyAddress")
        .value
        .trim();


    /* ---------------- VALIDATION ---------------- */

    if (name === "") {

        alert("Please enter Company Name.");

        document.getElementById("companyName").focus();

        return;

    }


    /* ---------------- DUPLICATE CHECK ---------------- */

    const alreadyExists =
        companies.some(function(company) {

            return company.name.toLowerCase() ===
                   name.toLowerCase();

        });


    if (alreadyExists) {

        alert("This Company already exists.");

        return;

    }


    /* ---------------- CREATE COMPANY ---------------- */

    const company = {

        id: Date.now(),

        name: name,

        address: address,

        createdAt:
            new Date().toISOString()

    };


    companies.push(company);


    /* ---------------- SAVE ---------------- */

    localStorage.setItem(
        "companies",
        JSON.stringify(companies)
    );


    /* ---------------- CLEAR FORM ---------------- */

    document.getElementById("companyName").value = "";

    document.getElementById("companyAddress").value = "";


    /* ---------------- UPDATE DROPDOWN ---------------- */

    updateCompanyDropdown("orderCompany");

    updateCompanyDropdown("deliveryCompany");


    alert("Company Save Successful");


    /* ---------------- DASHBOARD ---------------- */

    showPage("dashboardPage");

}


/* =========================================================
   6. GET COMPANY NAME
   ========================================================= */

function getCompanyName(companyId) {

    const company =
        companies.find(function(item) {

            return String(item.id) ===
                   String(companyId);

        });


    if (!company) {

        return "Unknown Company";

    }


    return company.name;

}


/* =========================================================
   7. CALCULATE ORDER TOTAL
   ========================================================= */

function calculateOrderTotal() {

    const inputs =
        document.querySelectorAll(".orderQty");


    let total = 0;


    inputs.forEach(function(input) {

        const value =
            Number(input.value) || 0;


        if (value > 0) {

            total += value;

        }

    });


    const totalCell =
        document.querySelector(".total-cell");


    if (totalCell) {

        totalCell.textContent =
            formatNumber(total);

    }

}


/* =========================================================
   8. SAVE ORDER
   ========================================================= */

function saveOrder() {

    const companyId =
        document.getElementById("orderCompany")
        .value;


    /* ---------------- COMPANY CHECK ---------------- */

    if (companyId === "") {

        alert("Please Select Company.");

        return;

    }


    const inputs =
        document.querySelectorAll(".orderQty");


    let quantities = [];

    let hasOrder = false;


    /* ---------------- GET QUANTITY ---------------- */

    inputs.forEach(function(input) {

        let value =
            Number(input.value) || 0;


        if (value < 0) {

            value = 0;

        }


        if (value > 0) {

            hasOrder = true;

        }


        quantities.push(value);

    });


    /* ---------------- ORDER CHECK ---------------- */

    if (!hasOrder) {

        alert(
            "Please enter at least one Order quantity."
        );

        return;

    }


    /* ---------------- CREATE ORDER ---------------- */

    const order = {

        id: Date.now(),

        companyId: companyId,

        quantities: quantities,

        date:
            new Date().toISOString()

    };


    orders.push(order);


    /* ---------------- SAVE ---------------- */

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    alert("Order Save Successful");


    /* ---------------- CLEAR ---------------- */

    clearOrderForm();


    /* ---------------- DELIVERY UPDATE ---------------- */

    updateDeliveryFields();

}


/* =========================================================
   9. CLEAR ORDER FORM
   ========================================================= */

function clearOrderForm() {

    const company =
        document.getElementById("orderCompany");


    if (company) {

        company.value = "";

    }


    document.querySelectorAll(".orderQty")
        .forEach(function(input) {

            input.value = "";

        });


    const totalCell =
        document.querySelector(".total-cell");


    if (totalCell) {

        totalCell.textContent = "0";

    }

}


/* =========================================================
   10. GET TOTAL ORDER FOR COMPANY
   ========================================================= */

function getCompanyOrder(companyId) {

    let total =
        Array(yarnCounts.length).fill(0);


    orders.forEach(function(order) {

        if (
            String(order.companyId) ===
            String(companyId)
        ) {

            order.quantities.forEach(
                function(value, index) {

                    total[index] +=
                        Number(value) || 0;

                }
            );

        }

    });


    return total;

}


/* =========================================================
   11. GET TOTAL DELIVERY FOR COMPANY
   ========================================================= */

function getCompanyDelivery(companyId) {

    let total =
        Array(yarnCounts.length).fill(0);


    deliveries.forEach(function(delivery) {

        if (
            String(delivery.companyId) ===
            String(companyId)
        ) {

            delivery.quantities.forEach(
                function(value, index) {

                    total[index] +=
                        Number(value) || 0;

                }
            );

        }

    });


    return total;

}


/* =========================================================
   12. GET COMPANY DUE
   ========================================================= */

function getCompanyDue(companyId) {

    const ordered =
        getCompanyOrder(companyId);


    const delivered =
        getCompanyDelivery(companyId);


    let due =
        Array(yarnCounts.length).fill(0);


    for (
        let i = 0;
        i < yarnCounts.length;
        i++
    ) {

        due[i] =
            ordered[i] -
            delivered[i];


        if (due[i] < 0) {

            due[i] = 0;

        }

    }


    return due;

}


/* =========================================================
   13. DELIVERY FIELD CONTROL
   ========================================================= */

function updateDeliveryFields() {

    const companySelect =
        document.getElementById("deliveryCompany");


    const inputs =
        document.querySelectorAll(".deliveryQty");


    if (!companySelect || !inputs.length) {

        return;

    }


    const companyId =
        companySelect.value;


    /* =====================================================
       COMPANY SELECT না করলে সব DISABLED
       ===================================================== */

    if (companyId === "") {

        inputs.forEach(function(input) {

            input.blank = true;

            input.value = "";

            input.removeAttribute("text");

            input.placeholder = "Select Company";

        });


        calculateDeliveryTotal();

        return;

    }


    /* =====================================================
       COMPANY ORDER
       ===================================================== */

    const ordered =
        getCompanyOrder(companyId);


    /* =====================================================
       COMPANY DELIVERY
       ===================================================== */

    const delivered =
        getCompanyDelivery(companyId);


    /* =====================================================
       EACH YARN COUNT
       ===================================================== */

    inputs.forEach(function(input, index) {

        const orderQty =
            Number(ordered[index]) || 0;


        const deliveryQty =
            Number(delivered[index]) || 0;


        const due =
            orderQty - deliveryQty;


        /* =================================================
           ORDER নেই
           ================================================= */

        if (orderQty <= 0) {

            input.blank = true;

            input.value = "";

            input.removeAttribute("Text");

            input.placeholder = "No Order";

            return;

        }


        /* =================================================
           ORDER আছে কিন্তু Due শেষ
           ================================================= */

        if (due <= 0) {

            input.blank = true;

            input.value = "";

            input.removeAttribute("text");

            input.placeholder = "Completed";

            return;

        }


        /* =================================================
           ORDER আছে + Due আছে
           ================================================= */

        input.blank = false;

        input.max = due;

        input.min = 0;

        input.placeholder =
            "Max " + formatNumber(due);


        /* যদি পুরোনো value Due-এর বেশি হয় */

        if (
            Number(input.value) >
            due
        ) {

            input.value = due;

        }

    });


    calculateDeliveryTotal();

}


/* =========================================================
   14. DELIVERY TOTAL
   ========================================================= */

function calculateDeliveryTotal() {

    const inputs =
        document.querySelectorAll(".deliveryQty");


    let total = 0;


    inputs.forEach(function(input) {

        if (input.blank) {

            return;

        }


        const value =
            Number(input.value) || 0;


        if (value > 0) {

            total += value;

        }

    });


    const totalCell =
        document.querySelector(
            ".delivery-total-cell"
        );


    if (totalCell) {

        totalCell.textContent =
            formatNumber(total);

    }

}


/* =========================================================
   15. DELIVERY INPUT CONTROL
   ========================================================= */

function handleDeliveryInput(input) {

    const companyId =
        document.getElementById(
            "deliveryCompany"
        ).value;


    if (!companyId) {

        input.value = "";

        return;

    }


    const inputs =
        Array.from(
            document.querySelectorAll(
                ".deliveryQty"
            )
        );


    const index =
        inputs.indexOf(input);


    if (index === -1) {

        return;

    }


    const ordered =
        getCompanyOrder(companyId);


    const delivered =
        getCompanyDelivery(companyId);


    const orderQty =
        Number(ordered[index]) || 0;


    const deliveryQty =
        Number(delivered[index]) || 0;


    const due =
        orderQty - deliveryQty;


    let current =
        Number(input.value) || 0;


    /* ---------------- NEGATIVE ---------------- */

    if (current < 0) {

        current = 0;

    }


    /* ---------------- DUE LIMIT ---------------- */

    if (current > due) {

        current = due;


        alert(
            yarnCounts[index] +
            " এর সর্বোচ্চ Delivery = " +
            formatNumber(due)
        );

    }


    input.value =
        current === 0 ? "" : current;


    calculateDeliveryTotal();

}


/* =========================================================
   16. SAVE DELIVERY
   ========================================================= */

function saveDelivery() {

    const companySelect =
        document.getElementById(
            "deliveryCompany"
        );


    const companyId =
        companySelect.value;


    /* ---------------- COMPANY CHECK ---------------- */

    if (companyId === "") {

        alert("Please Select Company.");

        return;

    }


    const inputs =
        document.querySelectorAll(
            ".deliveryQty"
        );


    let quantities = [];

    let hasDelivery = false;


    /* =====================================================
       CHECK EACH COUNT
       ===================================================== */

    inputs.forEach(function(input, index) {

        let value =
            Number(input.value) || 0;


        /* Blank হলে ZERO */

        if (input.blank) {

            value = 0;

        }


        /* Negative বন্ধ */

        if (value < 0) {

            value = 0;

        }


        /* =================================================
           CHECK DUE
           ================================================= */

        const ordered =
            getCompanyOrder(companyId);


        const delivered =
            getCompanyDelivery(companyId);


        const due =
            (Number(ordered[index]) || 0) -
            (Number(delivered[index]) || 0);


        /* Due-এর বেশি হলে SAVE হবে না */

        if (value > due) {

            alert(
                yarnCounts[index] +
                " এর Delivery Due-এর বেশি দেওয়া হয়েছে."
            );

            throw new Error(
                "Delivery quantity exceeded due."
            );

        }


        if (value > 0) {

            hasDelivery = true;

        }


        quantities.push(value);

    });


    /* ---------------- NO DELIVERY ---------------- */

    if (!hasDelivery) {

        alert(
            "Order থাকা কোনো Yarn Count-এর Delivery দিন."
        );

        return;

    }


    /* =====================================================
       SAVE DELIVERY
       ===================================================== */

    const delivery = {

        id: Date.now(),

        companyId: companyId,

        quantities: quantities,

        date:
            new Date().toISOString()

    };


    deliveries.push(delivery);


    localStorage.setItem(
        "deliveries",
        JSON.stringify(deliveries)
    );


    alert(
        "Yarn Delivery Save Successful"
    );


    /* =====================================================
       CLEAR FORM
       ===================================================== */

    clearDeliveryForm();


    /* =====================================================
       RE-CALCULATE DELIVERY
       ===================================================== */

    updateDeliveryFields();


    /* =====================================================
       DUE LIST UPDATE
       ===================================================== */

    renderDueList();

}


/* =========================================================
   17. CLEAR DELIVERY FORM
   ========================================================= */

function clearDeliveryForm() {

    const companySelect =
        document.getElementById(
            "deliveryCompany"
        );


    if (companySelect) {

        companySelect.value = "";

    }


    document.querySelectorAll(
        ".deliveryQty"
    ).forEach(function(input) {

        input.value = "";

        input.blank = true;

        input.removeAttribute("max");

        input.placeholder =
            "Select Company";

    });


    const totalCell =
        document.querySelector(
            ".delivery-total-cell"
        );


    if (totalCell) {

        totalCell.textContent = "0";

    }

}


/* =========================================================
   18. DUE LIST RENDER
   ========================================================= */

function renderDueList() {

    const tbody =
        document.getElementById(
            "dueTableBody"
        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML = "";


    let grandTotal = 0;


    /* =====================================================
       CREATE COMPANY ROW
       ===================================================== */

    companies.forEach(function(company) {

        const due =
            getCompanyDue(company.id);


        const companyTotal =
            due.reduce(
                function(sum, value) {

                    return sum + value;

                },
                0
            );


        /* =================================================
           Due না থাকলে Row দেখাবে না
           ================================================= */

        if (companyTotal <= 0) {

            return;

        }


        const tr =
            document.createElement("tr");


        /* ---------------- COMPANY ---------------- */

        const companyCell =
            document.createElement("td");


        companyCell.textContent =
            company.name;


        tr.appendChild(companyCell);


        /* ---------------- YARN DUE ---------------- */

        due.forEach(function(value) {

            const td =
                document.createElement("td");


            td.textContent =
                formatNumber(value);


            tr.appendChild(td);

        });


        /* ---------------- TOTAL ---------------- */

        const totalCell =
            document.createElement("td");


        totalCell.textContent =
            formatNumber(companyTotal);


        totalCell.classList.add(
            "due-total"
        );


        tr.appendChild(totalCell);


        tbody.appendChild(tr);


        grandTotal +=
            companyTotal;

    });


    /* =====================================================
       FOOTER
       ===================================================== */

    updateDueFooter();


    const grandTotalCell =
        document.getElementById(
            "grandTotal"
        );


    if (grandTotalCell) {

        grandTotalCell.textContent =
            formatNumber(grandTotal);

    }

}


/* =========================================================
   19. DUE LIST FOOTER
   ========================================================= */

function updateDueFooter() {

    const footerCells =
        document.querySelectorAll(
            ".due-table tfoot th"
        );


    if (!footerCells.length) {

        return;

    }


    let totalByYarn =
        Array(yarnCounts.length).fill(0);


    let grandTotal = 0;


    /* =====================================================
       COMPANY BY COMPANY
       ===================================================== */

    companies.forEach(function(company) {

        const due =
            getCompanyDue(company.id);


        due.forEach(function(value, index) {

            totalByYarn[index] +=
                Number(value) || 0;


            grandTotal +=
                Number(value) || 0;

        });

    });


    /* =====================================================
       YARN TOTAL
       ===================================================== */

    totalByYarn.forEach(
        function(value, index) {

            const cell =
                footerCells[index + 1];


            if (cell) {

                cell.textContent =
                    formatNumber(value);

            }

        }
    );


    /* =====================================================
       GRAND TOTAL
       ===================================================== */

    const lastCell =
        footerCells[
            footerCells.length - 1
        ];


    if (lastCell) {

        lastCell.textContent =
            formatNumber(grandTotal);

    }

}


/* =========================================================
   20. FORMAT NUMBER
   ========================================================= */

function formatNumber(number) {

    const value =
        Number(number) || 0;


    if (
        Number.isInteger(value)
    ) {

        return String(value);

    }


    return value.toFixed(2);

}


/* =========================================================
   21. INPUT EVENTS
   ========================================================= */

document.addEventListener(
    "input",
    function(event) {


        /* ---------------- ORDER ---------------- */

        if (
            event.target.classList.contains(
                "orderQty"
            )
        ) {

            let value =
                Number(event.target.value);


            if (value < 0) {

                event.target.value = "";

            }


            calculateOrderTotal();

        }


        /* ---------------- DELIVERY ---------------- */

        if (
            event.target.classList.contains(
                "deliveryQty"
            )
        ) {

            handleDeliveryInput(
                event.target
            );

        }

    }
);


/* =========================================================
   22. COMPANY CHANGE EVENT
   ========================================================= */

document.addEventListener(
    "change",
    function(event) {


        if (
            event.target.id ===
            "deliveryCompany"
        ) {

            updateDeliveryFields();

        }


        if (
            event.target.id ===
            "orderCompany"
        ) {

            calculateOrderTotal();

        }

    }
);


/* =========================================================
   23. PRINT REPORT
   ========================================================= */

function printDueList() {

    renderDueList();


    setTimeout(function() {

        window.print();

    }, 100);

}


/* =========================================================
   24. REFRESH DATA
   ========================================================= */

function refreshAllData() {

    companies =
        JSON.parse(
            localStorage.getItem(
                "companies"
            )
        ) || [];


    orders =
        JSON.parse(
            localStorage.getItem(
                "orders"
            )
        ) || [];


    deliveries =
        JSON.parse(
            localStorage.getItem(
                "deliveries"
            )
        ) || [];


    updateCompanyDropdown(
        "orderCompany"
    );


    updateCompanyDropdown(
        "deliveryCompany"
    );


    updateDeliveryFields();


    renderDueList();

}


/* =========================================================
   25. PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {


        /* ---------------- DASHBOARD ---------------- */

        showPage(
            "dashboardPage"
        );


        /* ---------------- COMPANY ---------------- */

        updateCompanyDropdown(
            "orderCompany"
        );


        updateCompanyDropdown(
            "deliveryCompany"
        );


        /* ---------------- ORDER ---------------- */

        calculateOrderTotal();


        /* ---------------- DELIVERY ---------------- */

        updateDeliveryFields();


        calculateDeliveryTotal();


        /* ---------------- DUE ---------------- */

        renderDueList();

    }
);