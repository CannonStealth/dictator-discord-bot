import { Command } from "../structures/Commands";
import { Snowflake } from "discord.js";
const cooldowns = new Map<Snowflake, number>();

export default new Command({
  name: "joke",
  async run({ args, message, client }) {
    const cooldown = cooldowns.get(message.author.id);
    if (cooldown && cooldown > message.createdTimestamp)
      return message.channel.send("You cannot use this command right now");
 
    const joke = [
      "why did king cold buy a cooler?\n||because he missed his freiza(er)||",
      "What is common between me and Hitler?\n||We both wanna kill ourselves||",
      "What's the difference between Goku (the anime) and an elevator?\n||an elevator can raise a child||",
      "What do you call a gay grenade?\n||A fraggot||",
      "Where does Goku keep his ice cream?\n||In the Freiza||",
      "What do you do if you encounter a Chick-fil-A employee?\n||Run for your fucking life.||",
      "I made a website for orphans.\n||It doesn't have a home page.||",
      "A Jewish girl asked me for my number and I told her\n||we don't use the number system anymor  take my snap instead||",
      "What's the best way to pick up a Jewish Girl?\n||With a dustpan||", 
      "Who are the fastest readers in the country?\n||9/11 victims when they went through 98 stories in 7 seconds||",
      "A man went into a library and asked for a book on how to commit suicide.\n||The librarian said fuck off, you won't bring it back.||",
      "You ever have that friend in a wheelchair who talks shit and then he gets destroyed but your friend asks him to 'stand up' for himself and 'walk it off'?",
      "What the difference between Harry Potter and a Jew?\n||Harry could escape from the chamber||",
      "What do you call a gay frog?\n||A froggot||",
      "What's the worst part of being black and Jewish?\n||You have to sit in the back of the oven||",
      "What's the difference between Hitler and Michel Phelps?\n||Michal Phelps can finish a race||",
      "What's the only gun not existing in Africa?\n||The water gun||",
      "My football jersey broke so I had to go get one at New Jersey.",
      "What's harry Potters favorite spell?\n||Erectus giganticus||",
      "Why is the graveyard the most popular place in the world?\n||People are just dying to get there.||",
      "What is the difference between the queen and Paul walker?\n||Paul Walker got to 100 first.||",
      "what kind of games does an African gaming channel play?\n||the hunger games||",
      "What is dangerous but usually never used, harmless when It's owner is friendly and hurtful when it's owner is furious?\n||A shotgun||",
      "What is black, white and red all over\n||A raccoon in a blender||",
      "what is green, has wheels, and can fly? ||a tractor, I lied about the flying||",
      "What superhero can beat Captain America?\n||Captain Vietnam||",
      "What's yellow and can't swim?\n||A bus full of children||",
      "In a car with a black man and a gypsie who is driving?\n||The police||",
      "My Grandfather says I'm too reliant on technology\n||So I called him a hypocrite and unplugged his life support||", 
      "I asked a bunch of people what LGBTQ+ stands for.\n||For some reason nobody gave me a straight answer||", 
      "What do you call 6 gay men in war?\n||Rainbow 6 siege||",
      "My wife and i was out dining today and the waiter started flirting with me, so my wife said:\nShe obviously has covid\nI ask her: how come dear\n||And she respond because she has no taste||",
      "Do you know why you never see an Elephant hiding in a tree?\n||Because they're good at it||",
      "What goes in hard and dry then comes out wet and soft?\n||A chewing gum||",
      "Why does Santa Claus have such a big sack?\n||He only comes once a year||",
      "Why can't a orphanage play baseball?\n||They don't know what home bases are||",
      "Where is the most popular place for a significant other to get lost at\n||The grocery store.",
      "What is black and white and red all over?\n||A newspaper||",
      "Whats harry Potters favourite spell?\n||Erectus giganticus||",
      "Whats the only gun not existing in Africa?\n||The water gun||",
      "Corona might be the only thing China made that lasted longer than 1 month.",
      "stfu now YOU tell ME a joke",
    ];

    const random = joke[Math.floor(Math.random() * joke.length)];

    message.channel.send(random);

    cooldowns.set(
      message.author.id,
      message.createdTimestamp + 1000 * 60
    );
    return;
  },
});
