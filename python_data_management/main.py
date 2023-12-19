import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import scipy.stats
import seaborn
from scipy.stats import normaltest
import statsmodels.api as sm
from sklearn import preprocessing

pd.set_option("display.max_columns", None)
pd.set_option("display.width", 1000)
# seaborn.set(rc={'figure.figsize': (30, 10)})
plt.ion()


def read_and_format(preview=0):
    rat_sv = pd.read_csv("rat_data/Transit app rat reports - 2023-10-02 to 2023-11-01.csv")

    rat_sv = rat_sv.drop(columns=["lines_served"], axis=1)
    rat_sv["total_voters"] = rat_sv[["so_many", "one_or_two", "none"]].sum(axis=1)
    rat_sv = rat_sv.sort_values("total_voters", ascending=False)

    rat_sv["% so_many"] = rat_sv["so_many"] / rat_sv["total_voters"]
    rat_sv["% one_or_two"] = rat_sv["one_or_two"] / rat_sv["total_voters"]
    rat_sv["% none"] = rat_sv["none"] / rat_sv["total_voters"]
    rat_sv["seen_rats"] = rat_sv["so_many"] + rat_sv["one_or_two"]
    rat_sv["% rats"] = (rat_sv["so_many"] + rat_sv["one_or_two"]) / rat_sv["total_voters"]

    if preview:
        print(rat_sv.head(preview))

    return rat_sv


def plot_total_rat_sightings(df):
    plt.figure(figsize=(30, 10))
    ax = seaborn.barplot(x=df["station_name"], y=df["seen_rats"], errorbar=None)
    # plot = seaborn.boxplot(x=df["station_name"], y=df["so_many"] + df["one_or_two"])
    ax.set_xticklabels(ax.get_xticklabels(), rotation=90)
    plt.show()


def plot_percent_rat_sightings(df):
    plt.figure(figsize=(30, 10))
    ax = seaborn.boxplot(x=df["% rats"])
    ax.set(xlabel="% Rats Sighted")
    ax.set_xticks(np.arange(0, 1, 0.05))
    ax.set_xticklabels(ax.get_xticklabels(), rotation=90)
    plt.show()


# def lognorm(df):
#     df["norm_seen_rats"] = preprocessing.normalize([np.array(df["seen_rats"])])[0]
#     df["lognorm_seen_rats"] = np.log(df["norm_seen_rats"])
#
#     plt.figure(figsize=(30, 10))
#     ax = seaborn.barplot(x=df["station_name"], y=df["lognorm_seen_rats"])
#     ax.set_xticklabels(ax.get_xticklabels(), rotation=90)
#     plt.show()

def exp_fit(df):
    def exp_func(t, a, b, c):
        return a * np.exp(b * t) + c

    df = df.sort_values("seen_rats", ascending=False)

    y_vals = df["seen_rats"]
    x_vals = np.arange(0, len(y_vals))
    popt, pcov = scipy.optimize.curve_fit(exp_func, x_vals, y_vals)
    print(popt, pcov)

    plt.figure(figsize=(30, 10))
    ax = seaborn.scatterplot(x=df["station_name"], y=df["seen_rats"])
    ax.set_xticklabels(ax.get_xticklabels(), rotation=90)
    # ax.plot(x_vals, exp_func(x_vals, *popt), "r-", label="Fitted Curve")
    plt.show()


def filter_outliers(df):
    lower_quantile, upper_quantile = df["seen_rats"].quantile([.25, .75])
    iqr = upper_quantile - lower_quantile
    median = df["seen_rats"].median()
    lower_outlier, upper_outlier = median - (1.5 * iqr), median + (1.5 * iqr)

    chopped_data = df.loc[
        (df["seen_rats"] < upper_outlier) &
        (df["seen_rats"] > lower_outlier)
        ]
    print(chopped_data.head(20))
    print(normaltest(chopped_data["seen_rats"]))

    sm.qqplot(chopped_data["seen_rats"], line="45")
    plt.show()

    plt.figure()
    plt.hist(chopped_data["seen_rats"], bins=np.arange(0, 35, 5))
    plt.show()


# print(normaltest(chopped_data["% rats"]))
# # plt.figure()
# plot = seaborn.barplot(x=chopped_data["station_name"], y=chopped_data["so_many"] + chopped_data["one_or_two"])
# plot.set_xticklabels(plot.get_xticklabels(), rotation=90)q

if __name__ == '__main__':
    rat_sv = read_and_format(preview=0)
    plot_total_rat_sightings(rat_sv)
    # plot_percent_rat_sightings(rat_sv)
    # lognorm(rat_sv)
    # exp_fit(rat_sv)
    # filter_outliers(rat_sv)
    plt.waitforbuttonpress()
