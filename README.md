__TL;DR we are putting a hold on new keyboards being added to VIA until we have improved both VIA and how it is supported in QMK.__

Hello everyone,

First off, we’re extremely honored to see all the excitement the community has for VIA configurator. When Wilba and Olivia first envisioned VIA, we knew we were onto something, but didn’t think everyone would be so eager to get their hands on it!

With that being said - we need to talk about the state of QMK and VIA. __In short, neither QMK nor VIA are ready for new keyboards to be added with VIA support.__ The current state of both the QMK and VIA code that makes this all work is essentially “alpha” - the bare minimum feature set to keep most people happy (like the Rama M60-A users), but the code is mostly specific to working with Wilba’s PCBs and what he needed for them, and is not generalized enough or integrated enough in QMK to support other keyboards and their associated features.

We wish we could allow everyone’s keyboard into VIA, and again, we’re very happy that people are so eager to use VIA, but we are looking ahead towards the future and want to avoid a bad situation. Let us explain:

As it stands right now, there are some key problems with both the VIA code and QMK code that supports dynamic keymaps. While we can get into the nitty gritty details, we’ll summarize it by saying that both VIA and QMK need some serious refactors in order to facilitate good, clean contributions in the future and implement some upcoming new features. The protocol between PC and device isn’t even finalized yet, and can change at any moment as necessary. 

Moving forward, we need the flexibility to move fast and break things until VIA is ready for primetime. If we were to accept keyboards into VIA today, as we moved forward, we would also have to worry about breaking VIA for those keyboards. Not to mention - there is a non-zero cost to reviewing PRs, testing, and cutting releases. We really want to focus on the core VIA work, and these things will distract us from getting VIA into a state where we feel comfortable supporting everyone’s keyboards.

Most of us have worked on projects that were wrought with bad, spaghetti code, and lacked any sort of reasonable organization.This can often happen in open source projects without good processes and design, and this is also exactly what we’re trying to avoid. If you would like to contribute to VIA development, we welcome your contributions. But please, come talk to us first! We need to plan a solid software engineering architecture, so we’d like everyone to be on board with that before implementing new features.

Again, we know this isn’t a great situation. We didn’t realize demand for VIA would be so high, but the fact of the matter is that we’re simply not ready to accept new keyboards into VIA. There is a lot of work to be done, and we need to stay focused on that work. While we wish we had unlimited cycles to work on VIA, all of us also have day jobs and work on this as a side project. We aren’t making this decision lightly, but we all believe it will pay off in droves in the future, for VIA.

If you have any questions or concerns, please let us know in the #via channel in the QMK discord.

Thank you,

VIA Development Team
