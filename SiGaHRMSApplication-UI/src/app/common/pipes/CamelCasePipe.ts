import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'camelCase' })
export class CamelCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Split the string into words
    const words = value.trim().toLowerCase().split(' ');
    
    // Capitalize the first letter of each word except the first word
    const camelCaseWords = words.map((word, index) => {
      if (index === 0) {
        return word;
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
    });
    
    // Join the words into a single string with no spaces
    return camelCaseWords.join('');
  }
}
