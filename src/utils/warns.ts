import { GuildMember, TextChannel, User } from "discord.js";
import mongoose from "mongoose";
import Client from "../structures/Client";
import convert from "./time";

export const warns = mongoose.model<
  mongoose.Document<any> & {
    _id: string;
    warns: {
      author: string;
      reason: string;
      time: number;
      timestamp: number;
    }[];
  }
>(
  "warns",
  new mongoose.Schema({
    _id: {
      type: String,
      required: true,
    },
    warns: {
      type: [Object],
      default: null,
    },
  })
);

export async function warn(
  user: GuildMember,
  author: User,
  reason: string | undefined,
  client: Client,
  channel: TextChannel,
  time?: number
) {
  try {
    const amount =
      (
        await warns.findByIdAndUpdate(
          user.id,
          {
            $push: {
              warns: {
                author: author.id,
                reason,
                time: time ?? 0,
                timestamp: Math.round(Date.now() / 1000),
              } as any,
            },
          },
          { upsert: true, new: true }
        )
      ).warns?.length || 1;

    if (amount < 1) {
      return;
    } else if (amount === 1 || amount === 2) {
      channel.send(`<@${user.id}> got muted for ${convert(1000 * 3600)}`);
      user.timeout(1000 * 3600, `Reached warn #${amount}`);
    } else if (amount === 3) {
      channel.send(`<@${user.id}> got muted for ${convert(1000 * 3600 * 3)}`);
      user.timeout(1000 * 3600 * 3, `Reached warn #${amount}`);
    } else if (amount >= 4) client.ban(user, channel);

    return;
  } catch {
    return;
  }
}

export async function removeWarns() {
  const warnings = await warns.find();

  if (!warnings?.length) return;

  for (const warn of warnings) {
    if (!warn.warns || !warn.warns.length) {
      await warns.findByIdAndDelete(warn._id);
      continue;
    }

    for (const thisWarn of warn.warns) {
      if (thisWarn.time && thisWarn.time <= Date.now()) {
        await warns.findByIdAndUpdate(warn._id, {
          $pull: {
            warns: thisWarn as any,
          },
        });
      } else continue;
    }
  }
}
