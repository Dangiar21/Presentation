import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os

# Create folder if it doesn't exist
os.makedirs("C:/Users/Dangi/Desktop/Präsentation/Bilder", exist_ok=True)

df = pd.read_csv("C:/Users/Dangi/Desktop/Präsentation/Datenbank/DEvideos.csv")
df = df.dropna(subset=['category_id', 'views'])

fig, axes = plt.subplots(1, 2, figsize=(14, 6))

cat_mapping = {10: "Music", 24: "Entertainment", 22: "People & Blogs", 23: "Comedy", 20: "Gaming", 26: "Howto & Style", 25: "News & Politics"}
df['Category'] = df['category_id'].map(cat_mapping).fillna('Other')
cat_views = df.groupby('Category')['views'].sum().sort_values(ascending=False).head(10)

axes[0].bar(cat_views.index, cat_views.values, color="teal")
axes[0].set_title("Views by Category")
axes[0].set_xlabel("Categories")
axes[0].set_ylabel("Views")
axes[0].tick_params(axis='x', rotation=45)

if 'Subscribers' in df.columns:
    x_val = df['Subscribers']
else:
    x_val = df['likes']

axes[1].scatter(x_val, df['views'], alpha=0.3, s=10, color='blue')
# Add a trendline
z = np.polyfit(np.log10(x_val[x_val>0] + 1), np.log10(df['views'][x_val>0] + 1), 1)
p = np.poly1d(z)
sorted_x = np.sort(x_val[x_val>0])
axes[1].plot(sorted_x, 10**(p(np.log10(sorted_x))), "r-", linewidth=2)

axes[1].set_xscale("log")
axes[1].set_yscale("log")
axes[1].set_title("Comparison of Number of Subscribers and Views with Regression Line")
axes[1].set_xlabel("Number of Subscribers")
axes[1].set_ylabel("Number of Views")

plt.tight_layout()
plt.savefig("C:/Users/Dangi/Desktop/Präsentation/Bilder/youtube_analyse_plot.png", dpi=150)
print("Plot generated successfully!")
