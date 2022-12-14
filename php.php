
 
def ciftMi(x): 
    return x % 2 == 0
 
toplam=0
sayac=0
baslangic = input("Başlangıç Sayısı :")
bitis = input("Bitiş Sayısı :")
for sayi in range (int(baslangic), int(bitis)+1):
    if(ciftMi(int(sayi))):
        toplam=toplam+sayi 
        sayac=sayac+1
print('Ortalama',(toplam/sayac))