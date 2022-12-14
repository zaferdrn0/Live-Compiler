
#include <iostream>
using namespace std;
int main()
{
   setlocale(LC_ALL,"Turkish"); //Türkçe karakter
   int y1,y2,y3;
   double ort;
   cout<<"1. Yazılıyı Girin : ";
   cin>>y1;
   cout<<"2. Yazılıyı Girin : ";
   cin>>y2;
   cout<<"3. Yazılıyı Girin : ";
   cin>>y3;
   ort=(double)(y1+y2+y3)/3;
   cout<<"Ortalama : "<<ort;
}