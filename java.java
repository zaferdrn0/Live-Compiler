 
#include<stdio.h>
int main() {
      double ilkSayi, ikinciSayi, temp;
      printf("Sayı 1: ");
      scanf("%lf", &ilkSayi);
      printf("Sayı 2: ");
      scanf("%lf", &ikinciSayi);
 
      temp = ilkSayi;
 
      ilkSayi = ikinciSayi;
 
      ikinciSayi = temp;
 
      printf("\nDeğişiklikten sonra ilkSayi = %.2lf\n", ilkSayi);
      printf("Değişiklikten sonra ikinciSayi = %.2lf", ikinciSayi);
      return 0;
}
 