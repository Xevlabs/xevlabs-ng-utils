import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'flagEmoji'
})
export class FlagEmojiPipe implements PipeTransform {

    transform(value: string): string {
        const codePoints = value
            .toUpperCase()
            .split('')
            .map((char: any) => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints)
    }

}
