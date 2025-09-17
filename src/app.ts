const expenseChart = {
    data: [
        {
            day: "monday",
            amount: 17.45,
        },
        {
            day: "tuesday",
            amount: 34.91,
        },
        {
            day: "wednesday",
            amount: 52.36,
        },
        {
            day: "thursday",
            amount: 31.07,
        },
        {
            day: "friday",
            amount: 23.39,
        },
        {
            day: "saturday",
            amount: 43.28,
        },
        {
            day: "sunday",
            amount: 25.48,
        },
    ],

    userFirstTimeUsing: true,
    currentCellIndex: 0,
    chartTutorial: document.querySelector(".tutorial") as HTMLElement,
    chartTutorialCloseBtn: document.querySelector(".tutorial button") as HTMLElement,
    chartGrid: document.querySelector(".bar-chart__grid") as HTMLElement,
    chartRows: document.querySelectorAll(".bar-chart__row") as NodeListOf<HTMLElement>,
    chartBarMaxHeightPx: 150,
    chartCellList: [] as HTMLElement[],
    spendingMaxAmount: 0,

    selectNextCell() {
        this.chartCellList[this.currentCellIndex].setAttribute("tabIndex", "-1");
        if (this.currentCellIndex == this.chartCellList.length - 1) {
            this.currentCellIndex = 0;
        } else {
            this.currentCellIndex++;
        }
        this.chartCellList[this.currentCellIndex].setAttribute("tabIndex", "0");
        this.chartCellList[this.currentCellIndex].focus();
    },
    selectPrevCell() {
        this.chartCellList[this.currentCellIndex].setAttribute("tabIndex", "-1");
        if (this.currentCellIndex == 0) {
            this.currentCellIndex = this.chartCellList.length - 1;
        } else {
            this.currentCellIndex--;
        }
        this.chartCellList[this.currentCellIndex].setAttribute("tabIndex", "0");
        this.chartCellList[this.currentCellIndex].focus();
    },
    selectFirstCell() {
        this.chartCellList[this.currentCellIndex].setAttribute("tabIndex", "-1");
        this.currentCellIndex = 0;
        this.chartCellList[this.currentCellIndex].setAttribute("tabIndex", "0");
        this.chartCellList[this.currentCellIndex].focus();
    },
    selectLastCell() {
        this.chartCellList[this.currentCellIndex].setAttribute("tabIndex", "-1");
        this.currentCellIndex = this.chartCellList.length - 1;
        this.chartCellList[this.currentCellIndex].setAttribute("tabIndex", "0");
        this.chartCellList[this.currentCellIndex].focus();
    },

    handleCellKeydown(e: Event) {
        if (!(e instanceof KeyboardEvent)) return;

        if (e.key == "ArrowUp" || e.key == "ArrowRight") {
            this.selectNextCell();
            e.preventDefault();
        } else if (e.key == "ArrowDown" || e.key == "ArrowLeft") {
            this.selectPrevCell();
            e.preventDefault();
        } else if (e.key == "Home") {
            this.selectFirstCell();
            e.preventDefault();
        } else if (e.key == "End") {
            this.selectLastCell();
            e.preventDefault();
        } else if (e.key == "Escape") {
            this.chartCellList[this.currentCellIndex].blur();
        }
    },
    handleCellClick(e: Event) {
        const clickedCellIndex = this.chartCellList.indexOf(e.currentTarget as HTMLElement);
        this.chartCellList[this.currentCellIndex].setAttribute("tabIndex", "-1");
        this.currentCellIndex = clickedCellIndex;
        this.chartCellList[this.currentCellIndex].setAttribute("tabIndex", "0");
    },
    showTutorial() {
        this.chartTutorial.removeAttribute("hidden");
    },
    hideTutorial() {
        this.chartTutorial.setAttribute("hidden", "");
    },

    init() {
        this.spendingMaxAmount = Math.max(...this.data.map((v) => v.amount));
        this.data.forEach(({ day, amount }) => {
            const amountText = amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                currency: "USD",
                style: "currency",
            });

            const chartCell = document.createElement("div");
            chartCell.classList.add("bar-chart__cell");
            chartCell.setAttribute("role", "gridcell");
            chartCell.setAttribute("tabIndex", "-1");

            const chartBar = document.createElement("div");
            chartBar.classList.add("bar-chart__track");
            chartBar.style.height = `${this.chartBarMaxHeightPx}px`;

            const chartBarLabel = document.createElement("span");
            chartBarLabel.classList.add("bar-chart__label");
            chartBarLabel.setAttribute("aria-hidden", "true");
            chartBarLabel.textContent = day.slice(0, 3);

            const chartBarInner = document.createElement("div");
            chartBarInner.classList.add("bar-chart__fill");

            const chartBarInnerValue = document.createElement("span");
            chartBarInnerValue.classList.add("bar-chart__fill-value");
            if (amount == this.spendingMaxAmount) chartBarInnerValue.setAttribute("highest", "");
            chartBarInnerValue.style.height = `${(amount * this.chartBarMaxHeightPx) / this.spendingMaxAmount}px`;

            const chartBarInnerTooltip = document.createElement("span");
            chartBarInnerTooltip.classList.add("bar-chart__fill-tooltip");
            chartBarInnerTooltip.setAttribute("aria-hidden", "true");
            chartBarInnerTooltip.textContent = amountText;

            const charBarDescription = document.createElement("span");
            charBarDescription.classList.add("sr-only");
            charBarDescription.textContent = day + ": " + amountText;

            this.chartCellList.push(chartCell);
            this.chartRows[0].appendChild(chartCell);
            chartCell.appendChild(chartBar);
            chartCell.appendChild(chartBarLabel);
            chartBar.appendChild(chartBarInner);
            chartBarInner.appendChild(charBarDescription);
            chartBarInner.appendChild(chartBarInnerValue);
            chartBarInner.appendChild(chartBarInnerTooltip);

            chartCell.addEventListener("keydown", (e) => {
                this.handleCellKeydown(e);
            });
            chartCell.addEventListener("click", (e) => {
                this.handleCellClick(e);
            });

            chartCell.addEventListener("focus", () => {
                if (this.userFirstTimeUsing) {
                    this.showTutorial();
                }
            });

            this.chartTutorialCloseBtn.addEventListener("click", () => {
                this.hideTutorial();
                this.userFirstTimeUsing = false;
                this.chartCellList[this.currentCellIndex].focus();
            });
        });

        this.chartCellList[0].setAttribute("tabIndex", "0");
    },
};

expenseChart.init();
