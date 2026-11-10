"""Generate synthetic land-levelling point data. Not real survey data.
Install: pip install numpy pandas
Run: python generate_synthetic_terrain.py
"""
import numpy as np, pandas as pd
from pathlib import Path
out=Path("generated_synthetic_data"); out.mkdir(exist_ok=True)
rng=np.random.default_rng(42); c=np.linspace(0,20,21); X,Y=np.meshgrid(c,c)
before=100+0.035*X-0.020*Y+0.45*np.exp(-(((X-6)**2)/(2*4.5**2)+((Y-13)**2)/(2*5**2)))+0.22*np.sin(X/4.8)*np.cos(Y/5.5)+rng.normal(0,.015,X.shape)
target=100.22+0.008*X-0.006*Y
after=before-0.68*(before-target)+0.012*np.sin(X/3.5)*np.sin(Y/4.2)
d=before-after; rows=[]
for j,y in enumerate(c):
 for i,x in enumerate(c): rows.append({"x_m_local":x,"y_m_local":y,"z_before_m_synthetic":before[j,i],"z_after_m_synthetic":after[j,i],"surface_change_before_minus_after_m":d[j,i]})
pd.DataFrame(rows).to_csv(out/"synthetic_terrain_points.csv",index=False)
print("SYNTHETIC ONLY | cut m3:",np.maximum(d,0).sum(),"fill m3:",np.maximum(-d,0).sum())
